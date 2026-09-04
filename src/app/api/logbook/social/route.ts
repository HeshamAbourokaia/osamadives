import { NextResponse } from "next/server";
import { isValidId } from "@/lib/logbook/ids";
import { validDeviceId } from "@/lib/logbook/ratelimit";
import { getStore } from "@/lib/logbook/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reaction counts and this device's own reactions for a batch of reviews. The wall asks
// once per page of reviews rather than once per card.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get("ids") || "").split(",").filter(isValidId).slice(0, 60);
  const device = url.searchParams.get("device");
  const deviceId = validDeviceId(device) ? device : "";
  if (!ids.length) return NextResponse.json({ reactions: {}, mine: {} });
  try {
    const store = getStore({ fresh: true });
    const [reactions, mine] = await Promise.all([
      store.reactionCounts(ids),
      deviceId ? store.reactionsBy(ids, deviceId) : Promise.resolve({}),
    ]);
    return NextResponse.json({ reactions, mine }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("social lookup failed", e);
    return NextResponse.json({ reactions: {}, mine: {} }, { headers: { "cache-control": "no-store" } });
  }
}
