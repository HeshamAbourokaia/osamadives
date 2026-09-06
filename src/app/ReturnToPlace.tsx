"use client";

import { useEffect } from "react";

const KEY = "od_home_y";

// Remembers how far down the homepage the visitor was, so an inner page can send them
// straight back there (/#back) instead of to the top of the dive.
export default function ReturnToPlace() {
  useEffect(() => {
    let t = 0;
    const save = () => {
      if (t) return;
      t = window.setTimeout(() => { t = 0; try { sessionStorage.setItem(KEY, String(Math.round(window.scrollY))); } catch { /* private window */ } }, 200);
    };
    window.addEventListener("scroll", save, { passive: true });

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const wantsBack = window.location.hash === "#back" || nav?.type === "back_forward";
    if (wantsBack) {
      let y = 0;
      try { y = Number(sessionStorage.getItem(KEY) || 0); } catch { /* nothing saved */ }
      if (y > 0) {
        // The scroll engine sets the page's height a moment after hydration; land after it.
        const land = () => window.scrollTo({ top: y, behavior: "auto" });
        land();
        const again = window.setTimeout(land, 350);
        const once = window.setTimeout(land, 900);
        if (window.location.hash === "#back") history.replaceState(null, "", window.location.pathname);
        return () => { window.removeEventListener("scroll", save); clearTimeout(again); clearTimeout(once); };
      }
    }
    return () => window.removeEventListener("scroll", save);
  }, []);
  return null;
}
