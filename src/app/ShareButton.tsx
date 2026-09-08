"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Share, the way the phone already does it. navigator.share opens the sheet the
 * person already knows: WhatsApp, Messenger, Instagram, a text message, AirDrop or
 * Nearby Share, whatever they actually have. One button instead of a row of logos.
 * Where the browser has no sheet, mostly a desk, it falls back to WhatsApp, which
 * is the one channel this site asks people to use, and says so: fallbackLabel keeps
 * the desk reading exactly as it did before.
 */
export default function ShareButton({ url, title, label = "Share", fallbackLabel, className = "" }: { url: string; title?: string; label?: string; fallbackLabel?: string; className?: string }) {
  const [native, setNative] = useState(false);
  useEffect(() => { setNative(typeof navigator !== "undefined" && typeof navigator.share === "function"); }, []);

  const share = useCallback(async (e: React.MouseEvent) => {
    if (!native) return; // let the WhatsApp link do its job
    e.preventDefault();
    try {
      await navigator.share({ title, url });
    } catch {
      /* the sheet was dismissed, or the browser refused: nothing to report */
    }
  }, [native, title, url]);

  const wa = `https://wa.me/?text=${encodeURIComponent(title ? `${title} ${url}` : url)}`;
  return (
    <a className={className} href={wa} target="_blank" rel="noopener noreferrer" onClick={share} aria-label={title ? `Share ${title}` : "Share this page"}>
      {native ? label : fallbackLabel ?? label}
    </a>
  );
}
