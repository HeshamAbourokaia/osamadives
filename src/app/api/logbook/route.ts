import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/logbook/config";
import { newId } from "@/lib/logbook/ids";
import { notifyNewEntry } from "@/lib/logbook/notify";
import { PhotoError, savePhoto } from "@/lib/logbook/photos";
import { DAILY_LIMIT, allowBurst, hashIp } from "@/lib/logbook/ratelimit";
import { assessEntry } from "@/lib/logbook/rules";
import { FORBIDDEN_MESSAGE, cleanText, findForbidden } from "@/lib/logbook/sanitize";
import { getStore } from "@/lib/logbook/store";
import { TTL, signToken } from "@/lib/logbook/tokens";
import { COURSES, LIMITS, SITE_KEYS, STAMP_KEYS, type LogbookEntry } from "@/lib/logbook/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return (forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "0.0.0.0").trim();
}

// Cloudflare Turnstile, only when a secret is configured.
async function botCheckPassed(token: FormDataEntryValue | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

const isOneOf = <T extends readonly string[]>(list: T, v: unknown): v is T[number] =>
  typeof v === "string" && (list as readonly string[]).includes(v);

function validDivedOn(v: string): boolean {
  if (v === "") return true;
  if (!/^\d{4}-\d{2}(-\d{2})?$/.test(v)) return false;
  const d = new Date(v.length === 7 ? `${v}-01` : v);
  if (Number.isNaN(d.getTime())) return false;
  return d.getUTCFullYear() >= 2011 && d.getTime() < Date.now() + 86_400_000;
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Could not read the form.");
  }
  // Honeypot: real people never see this field.
  if (form.get("website")) return fail("Something went wrong. Please try again.");

  const ip = clientIp(req);
  const ipHash = hashIp(ip);
  if (!allowBurst(ipHash)) return fail("That is a lot of pages in a short time. Try again in a few minutes.", 429);
  if (!(await botCheckPassed(form.get("cf-turnstile-response"), ip))) {
    return fail("The bot check did not pass. Reload the page and try again.");
  }

  const name = cleanText(form.get("name"), LIMITS.name.max);
  const country = cleanText(form.get("country"), LIMITS.country.max);
  const note = cleanText(form.get("note"), LIMITS.note.max, true);
  const divedOn = cleanText(form.get("divedOn"), 10);
  const site = form.get("site");
  const stamp = form.get("stamp");
  const course = form.get("course") ?? "";

  if (name.length < LIMITS.name.min) return fail("Tell Osama your name.");
  if (note.length < LIMITS.note.min) return fail("A few more words. Osama reads every page.");
  if (!isOneOf(SITE_KEYS, site)) return fail("Pick where you dived.");
  if (!isOneOf(STAMP_KEYS, stamp)) return fail("Pick a stamp.");
  if (!isOneOf(COURSES, course)) return fail("Pick a course, or leave it blank.");
  if (!validDivedOn(divedOn)) return fail("Check the date.");
  if (form.get("consent") !== "yes") return fail("Tick the box so Osama can show your page.");
  for (const text of [name, country, note]) {
    const forbidden = findForbidden(text);
    if (forbidden) return fail(FORBIDDEN_MESSAGE[forbidden]);
  }

  let store: ReturnType<typeof getStore>;
  try {
    store = getStore();
  } catch (e) {
    console.error("logbook storage not configured", e);
    return fail("The logbook is not open yet. Send your note to Osama on WhatsApp for now.", 503);
  }
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  if ((await store.countSince(ipHash, dayAgo)) >= DAILY_LIMIT) {
    return fail("Five pages a day is the limit. Come back tomorrow.", 429);
  }

  const id = newId();
  let photoUrl: string | null = null;
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      photoUrl = await savePhoto(photo, id);
    } catch (e) {
      if (e instanceof PhotoError) return fail(e.message);
      console.error("photo save failed", e);
      return fail("The photo could not be saved. Try without it.", 500);
    }
  }

  const { flags } = assessEntry({ name, country, note });
  const entry: LogbookEntry = {
    id, createdAt: new Date().toISOString(), status: "pending",
    name, country, site, divedOn, course, stamps: [stamp], note, photoUrl,
    flags, moderatedAt: null, ipHash,
    reply: "", featured: false, videoUrl: null,
  };
  await store.create(entry);

  const base = siteUrl();
  const moderate = signToken("moderate", id, TTL.moderate);
  const share = signToken("share", id, TTL.share);
  const cardPath = `/api/logbook/${id}/card?t=${share}`;
  await notifyNewEntry(entry, {
    approve: `${base}/api/logbook/moderate?id=${id}&action=approve&t=${moderate}`,
    hide: `${base}/api/logbook/moderate?id=${id}&action=hide&t=${moderate}`,
    view: `${base}${cardPath}`,
  });

  return NextResponse.json({ ok: true, id, cardUrl: cardPath });
}
