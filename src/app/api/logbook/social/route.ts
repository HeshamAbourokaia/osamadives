import { NextResponse } from "next/server";
import { isValidId } from "@/lib/logbook/ids";
import { validDeviceId } from "@/lib/logbook/ratelimit";
import { getStore } from "@/lib/logbook/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reaction counts, this device's own reactions, and approved comment counts for a batch
// of reviews. The wall asks once per page of reviews rather than once per card.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get("ids") || "").split(",").filter(isValidId).slice(0, 60);
  const device = url.searchParams.get("device");
  const deviceId = validDeviceId(device) ? device : "";
  if (!ids.length) return NextResponse.json({ reactions: {}, mine: {}, comments: {} });
  try {
    const store = getStore({ fresh: true });
    const [reactions, mine, comments] = await Promise.all([
      store.reactionCounts(ids),
      deviceId ? store.reactionsBy(ids, deviceId) : Promise.resolve({}),
      store.commentCounts(ids),
    ]);
    return NextResponse.json({ reactions, mine, comments }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("social lookup failed", e);
    return NextResponse.json({ reactions: {}, mine: {}, comments: {} }, { headers: { "cache-control": "no-store" } });
  }
}
