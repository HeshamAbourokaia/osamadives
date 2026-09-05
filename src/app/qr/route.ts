import { NextResponse } from "next/server";
import { newId } from "@/lib/logbook/ids";
import { clientIp, hashIp } from "@/lib/logbook/ratelimit";
import { getStore } from "@/lib/logbook/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The address printed in the QR code. Every scan lands here, is counted, and is sent on to
// the review form. Because the code points here and not at the form, where it leads can be
// changed later without reprinting anything. ?s= names the source (card, sticker, table).
// Link previews and crawlers fetch a pasted link too; those are not people with a phone.
const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|telegram|slack|discord|twitter|linkedin|curl|wget|python|http\.rb/i;

function sourceOf(url: URL) {
  return (url.searchParams.get("s") || "card").replace(/[^a-z0-9-]/gi, "").slice(0, 24) || "card";
}

function onward(url: URL, source: string) {
  const to = new URL("/review", url.origin);
  to.searchParams.set("utm_source", "qr");
  to.searchParams.set("utm_medium", source);
  to.searchParams.set("utm_campaign", "review");
  to.hash = "sign";
  return NextResponse.redirect(to, { status: 307, headers: { "cache-control": "no-store" } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const source = sourceOf(url);
  const ua = (req.headers.get("user-agent") || "").slice(0, 200);
  if (!BOT.test(ua)) {
    try {
      await getStore({ fresh: true }).recordScan({ id: newId(), createdAt: new Date().toISOString(), source, ua, ipHash: hashIp(clientIp(req)) });
    } catch (e) {
      console.error("qr scan not recorded", e); // never keep a student from the form over a count
    }
  }
  return onward(url, source);
}

// A HEAD request is a link checker or a monitor looking, not a scan. It is sent on, not counted.
export function HEAD(req: Request) {
  const url = new URL(req.url);
  return onward(url, sourceOf(url));
}
