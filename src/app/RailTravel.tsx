"use client";

import { useEffect } from "react";

// Measures how far each rail has to travel and hands it to CSS as --rail-travel, so the rail
// can pan on the act's own progress with a hold at the end (the engine's pan has no hold).
export default function RailTravel() {
  useEffect(() => {
    const rails = Array.from(document.querySelectorAll<HTMLElement>(".js-rail"));
    if (!rails.length) return;
    const measure = () => {
      for (const r of rails) {
        const travel = Math.max(0, r.scrollWidth - window.innerWidth);
        r.style.setProperty("--rail-travel", `${travel}px`);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    rails.forEach((r) => ro.observe(r));
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 800);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); clearTimeout(t); };
  }, []);
  return null;
}
