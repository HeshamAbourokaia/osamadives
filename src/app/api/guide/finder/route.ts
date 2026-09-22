import { NextResponse } from "next/server";
import { MAX_GUIDE_LENGTH } from "@/lib/guide/engine";
import { readFinder, usableFinder } from "@/lib/guide/jev";
import { allowBurst, clientIp, hashIp } from "@/lib/logbook/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One sentence about themselves in, the course finder's taps out. Nothing here
// decides what they can do; it only fills in the taps they would have pressed.
export async function POST(req: Request) {
  let body: { text?: unknown };
  try {
    body = (await req.json()) as { text?: unknown };
  } catch {
    return NextResponse.json({}, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > MAX_GUIDE_LENGTH) return NextResponse.json({}, { status: 400 });
  if (!allowBurst(hashIp(clientIp(req)), 20)) return NextResponse.json({}, { status: 429 });

  return NextResponse.json(usableFinder(await readFinder(text)));
}
