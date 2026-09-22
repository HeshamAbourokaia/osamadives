import { NextResponse } from "next/server";
import { MAX_GUIDE_LENGTH } from "@/lib/guide/engine";
import { readQuestion, usableReading } from "@/lib/guide/jev";
import { guideProfile } from "@/lib/guide/profile";
import { allowBurst, clientIp, hashIp } from "@/lib/logbook/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The browser asks here only when its own keyword matching drew a blank. The reply
// is an id from the reviewed list, or null; the words themselves live in the browser.
export async function POST(req: Request) {
  let body: { question?: unknown };
  try {
    body = (await req.json()) as { question?: unknown };
  } catch {
    return NextResponse.json({ id: null }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > MAX_GUIDE_LENGTH) return NextResponse.json({ id: null }, { status: 400 });
  // Twenty unplaced questions in ten minutes from one address is a conversation; more is a script.
  if (!allowBurst(hashIp(clientIp(req)), 20)) return NextResponse.json({ id: null }, { status: 429 });

  const reading = await readQuestion(guideProfile, question);
  return NextResponse.json({ id: usableReading(reading), confidence: reading?.confidence ?? null });
}
