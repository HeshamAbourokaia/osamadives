import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { moderatorKey } from "@/lib/logbook/session";
import { isValidId } from "@/lib/logbook/ids";
import { cleanText } from "@/lib/logbook/sanitize";
import { getStore } from "@/lib/logbook/store";
import { LIMITS } from "@/lib/logbook/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Actions from the private moderation page: save Osama's reply, the video link and the
// page-of-the-month flag, or approve / hide. Always lands back on the list.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return new Response("Bad request", { status: 400 });
  const given = form.get("key");
  const key = moderatorKey(typeof given === "string" ? given : undefined);
  if (!key) return new Response("Not found", { status: 404 });
  const id = form.get("id");
  const action = form.get("action");
  if (!isValidId(id)) return new Response("Bad request", { status: 400 });

  const store = getStore({ fresh: true });
  const now = new Date().toISOString();
  if (action === "approve" || action === "hide") {
    await store.setStatus(id, action === "approve" ? "approved" : "hidden", now);
  } else if (action === "delete") {
    await store.remove(id);
  } else if (action === "save") {
    const reply = cleanText(form.get("reply"), LIMITS.reply.max, true);
    const video = cleanText(form.get("videoUrl"), 300);
    const videoUrl = /^(\/|https:\/\/)/.test(video) ? video : null;
    await store.update(id, { reply, videoUrl, featured: form.get("featured") === "1" });
  } else {
    return new Response("Bad request", { status: 400 });
  }

  revalidatePath("/logbook");
  revalidatePath("/logbook/admin");
  revalidatePath(`/logbook/${id}`);
  revalidatePath("/");
  return NextResponse.redirect(new URL(`/logbook/admin?key=${encodeURIComponent(key)}&done=${action}#${id}`, req.url), 303);
}
