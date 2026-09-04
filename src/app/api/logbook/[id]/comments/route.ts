import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/logbook/config";
import { isValidId, newId } from "@/lib/logbook/ids";
import { notifyNewComment } from "@/lib/logbook/notify";
import { COMMENT_DAILY_LIMIT, allowBurst, clientIp, hashIp, validDeviceId } from "@/lib/logbook/ratelimit";
import { FORBIDDEN_MESSAGE, cleanText, findForbidden } from "@/lib/logbook/sanitize";
import { getStore } from "@/lib/logbook/store";
import { LIMITS, type ReviewComment } from "@/lib/logbook/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

// What readers see: only the approved comments, oldest first, and only the public fields.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!isValidId(id)) return fail("No such review.", 404);
  try {
    const rows = await getStore({ fresh: true }).listComments({ entryId: id, status: "approved" });
    const comments = rows.map((c) => ({ id: c.id, name: c.name, text: c.text, createdAt: c.createdAt }));
    return NextResponse.json({ comments }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("comment list failed", e);
    return NextResponse.json({ comments: [] }, { headers: { "cache-control": "no-store" } });
  }
}

// A reader leaves a few words. It waits for Osama, the same as a review does.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!isValidId(id)) return fail("No such review.", 404);
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return fail("Could not read that.");
  if (body.website) return fail("Something went wrong. Please try again."); // honeypot

  const ipHash = hashIp(clientIp(req));
  if (!allowBurst(`comment:${ipHash}`, 5)) return fail("That is a lot of comments in a short time. Try again in a few minutes.", 429);

  const name = cleanText(body.name, LIMITS.name.max);
  const text = cleanText(body.text, LIMITS.comment.max, true);
  const device = validDeviceId(body.device) ? body.device : "";
  if (name.length < LIMITS.name.min) return fail("Tell us your name.");
  if (text.length < LIMITS.comment.min) return fail("A few words at least.");
  for (const s of [name, text]) {
    const forbidden = findForbidden(s);
    if (forbidden) return fail(FORBIDDEN_MESSAGE[forbidden]);
  }

  try {
    const store = getStore({ fresh: true });
    const entry = await store.get(id);
    if (!entry || entry.status !== "approved") return fail("No such review.", 404);
    const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
    if ((await store.countCommentsSince(ipHash, dayAgo)) >= COMMENT_DAILY_LIMIT) {
      return fail("Ten comments a day is the limit. Come back tomorrow.", 429);
    }
    const comment: ReviewComment = {
      id: newId(), entryId: id, createdAt: new Date().toISOString(), status: "pending",
      name, text, deviceId: device, ipHash, moderatedAt: null,
    };
    await store.createComment(comment);
    await notifyNewComment(comment, entry.name, `${siteUrl()}/admin#comments`);
    return NextResponse.json({ ok: true, id: comment.id }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("comment save failed", e);
    return fail("That did not save. Try again in a moment.", 500);
  }
}
