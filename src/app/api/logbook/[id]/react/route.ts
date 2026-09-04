import { NextResponse } from "next/server";
import { isValidId } from "@/lib/logbook/ids";
import { allowBurst, clientIp, hashIp, validDeviceId } from "@/lib/logbook/ratelimit";
import { getStore } from "@/lib/logbook/store";
import { REACTIONS } from "@/lib/logbook/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

// Tap an emoji under a review: on if it was off, off if it was on. One per emoji per device.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!isValidId(id)) return fail("No such review.", 404);
  const body = (await req.json().catch(() => null)) as { emoji?: unknown; device?: unknown } | null;
  if (!body) return fail("Could not read that.");
  const { emoji, device } = body;
  if (typeof emoji !== "string" || !(REACTIONS as readonly string[]).includes(emoji)) return fail("Pick one of the emojis.");
  if (!validDeviceId(device)) return fail("Reload the page and try again.");

  try {
    // Forty taps in ten minutes is plenty for a person and nothing for a script.
    const ipHash = hashIp(clientIp(req));
    if (!allowBurst(`react:${ipHash}`, 40)) return fail("Slow down a little.", 429);

    const store = getStore({ fresh: true });
    const entry = await store.get(id);
    if (!entry || entry.status !== "approved") return fail("No such review.", 404);
    const on = await store.toggleReaction(id, emoji, device, new Date().toISOString());
    const counts = await store.reactionCounts([id]);
    return NextResponse.json({ ok: true, on, count: counts[id]?.[emoji] ?? 0 }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("reaction failed", e);
    return fail("That did not save. Try again in a moment.", 500);
  }
}
