"use client";

import { useEffect } from "react";

/**
 * Every tap on a WhatsApp link is counted from the site's side, with a beacon that
 * goes out as the link is followed and never holds it up. The share buttons are left
 * out: on a phone they open the sharing sheet, not WhatsApp, even though their fallback
 * address is a WhatsApp one.
 */
export default function WhatsAppCount() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("data-share") || typeof navigator.sendBeacon !== "function") return;
      navigator.sendBeacon("/api/wa", window.location.pathname);
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
  }, []);
  return null;
}
