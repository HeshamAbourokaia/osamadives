"use client";

import { useEffect } from "react";
import InstallCard from "./InstallCard";
import { QR_MODULES, QR_PATH, QR_URL } from "./qr";

export default function CardScreen() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/card-sw.js").catch(() => {});
    }
  }, []);

  const box = QR_MODULES;

  return (
    <main className="card">
      <div className="card__inner">
        <img src="/brand/stamp-512.png" alt="Osama Dives, Dahab, since 1983" className="card__stamp" width={132} height={132} />
        <h1 className="card__title">Write me a review</h1>

        <a className="card__code" href={QR_URL} aria-label="Open the review form">
          <svg viewBox={`0 0 ${box} ${box}`} role="img" aria-label="Code for osamadives.com/review" shapeRendering="crispEdges">
            <rect width={box} height={box} fill="#FFFDF8" />
            <path d={QR_PATH} fill="#171208" />
          </svg>
          <img src="/brand/stamp-512.png" alt="" className="card__code-stamp" width={72} height={72} />
        </a>

        <p className="card__how">Scan it, or press and hold to open</p>
        <p className="card__url">osamadives.com/review</p>

        <InstallCard />
      </div>
    </main>
  );
}
