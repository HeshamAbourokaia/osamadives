"use client";

import { useEffect, useState } from "react";
import { QR_MODULES, QR_PATH, QR_URL } from "./qr";

export default function CardScreen() {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/card-sw.js").catch(() => {});
    }
    // standalone means it was opened from the home screen, so the hint is not needed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setSaved(Boolean(standalone));
  }, []);

  const box = QR_MODULES;

  return (
    <main className="card">
      <div className="card__inner">
        <img src="/brand/stamp-512.png" alt="Osama Dives, Dahab, since 1983" className="card__stamp" width={132} height={132} />
        <h1 className="card__title">Write me a review</h1>

        <a className="card__code" href={QR_URL} aria-label="Open the review form">
          <svg viewBox={`0 0 ${box} ${box}`} role="img" aria-label="Code for osamadives.com/review" shapeRendering="crispEdges">
            <rect width={box} height={box} fill="#F2EDE2" />
            <path d={QR_PATH} fill="#171208" />
          </svg>
          <img src="/brand/stamp-512.png" alt="" className="card__code-stamp" width={72} height={72} />
        </a>

        <p className="card__how">Scan it &mdash; or press and hold to open</p>
        <p className="card__url">osamadives.com/review</p>

        {!saved ? (
          <p className="card__hint">
            Keep this on your home screen: tap Share, then Add to Home Screen. It opens without signal.
          </p>
        ) : null}
      </div>
    </main>
  );
}
