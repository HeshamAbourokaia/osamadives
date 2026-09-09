import { newId } from "@/lib/logbook/ids";
import { clientIp, hashIp } from "@/lib/logbook/ratelimit";
import { getStore } from "@/lib/logbook/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The same shapes /qr ignores: link previews and crawlers, not people with a phone.
const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|telegram|slack|discord|twitter|linkedin|curl|wget|python|http\.rb/i;

/**
 * One tap on a WhatsApp button, sent as a beacon the moment the link is followed, so
 * the tap costs the person nothing. WhatsApp gives Osama no way to know a message came
 * from the site; this is the count from the site's side, with the page and the time,
 * so a new message can be matched to a tap by the clock. It is stored beside the card
 * scans under its own source. Nothing here may ever get in the way of the tap: every
 * failure is swallowed.
 */
export async function POST(req: Request) {
  const ua = (req.headers.get("user-agent") || "").slice(0, 200);
  if (!BOT.test(ua)) {
    const raw = (await req.text().catch(() => "")).slice(0, 120);
    const page = /^\/(?!\/)[a-z0-9\-\/]*$/i.test(raw) ? raw : "";
    try {
      await getStore({ fresh: true }).recordScan({ id: newId(), createdAt: new Date().toISOString(), source: "wa", ua, ipHash: hashIp(clientIp(req)), page });
    } catch (e) {
      console.error("whatsapp tap not recorded", e);
    }
  }
  return new Response(null, { status: 204 });
}
