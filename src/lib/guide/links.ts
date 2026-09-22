import { diveSites } from "@/lib/dive-sites";

// A guide answer can only ever point at a page of this site, at Osama's WhatsApp,
// or at the one medical page it cites. Anything else, however it got into an
// answer, is dropped before it is rendered.
const PAGES = new Set<string>([
  "/", "/#peak-act", "/#school-act",
  "/diving-with-osama", "/before-you-arrive", "/dive-sites", "/logbook", "/blog", "/gallery",
  ...diveSites.map((s) => `/dive-sites/${s.slug}`),
]);
export const DAN_SCREENING = "https://dan.org/safety-prevention/return-to-diving-safely/health-status/";
const WHATSAPP_PREFIX = "https://wa.me/201090208050?text=";
const CONTROL = /[\x00-\x1f\\]/;

export function safeGuideHref(candidate: unknown, contactHref: string): string | null {
  if (typeof candidate !== "string" || candidate !== candidate.trim() || CONTROL.test(candidate)) return null;
  if (PAGES.has(candidate)) return candidate;
  if (candidate === contactHref && candidate.startsWith(WHATSAPP_PREFIX)) {
    try {
      const url = new URL(candidate);
      if (url.protocol === "https:" && url.hostname === "wa.me" && url.pathname === "/201090208050" && !url.username && !url.password && !url.port) return candidate;
    } catch {
      return null;
    }
  }
  if (candidate === DAN_SCREENING) return candidate;
  return null;
}

export const isExternal = (href: string) => href.startsWith("https://");
