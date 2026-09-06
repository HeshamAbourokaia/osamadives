"use client";

import { useEffect } from "react";

/**
 * Centre focus for the horizontal rails. Whatever card is nearest the middle of
 * the screen is sharp and full; its neighbours dim, and on a pointer screen soften,
 * so the eye is led one card at a time as the rail pans. The rail moves on a CSS
 * transform driven by the act's progress, which a scroll-driven timeline cannot
 * track, so this measures each card once per frame the page scrolls and hands
 * CSS a single number, --focus (1 at centre, 0 out at the sides). Without script
 * nothing is dimmed: the class that turns the styling on is added here.
 */
export default function RailFocus() {
  useEffect(() => {
    const rails = Array.from(document.querySelectorAll<HTMLElement>(".js-rail"));
    if (!rails.length) return;
    rails.forEach((r) => r.classList.add("rail-focus"));
    let frame = 0;

    const measure = () => {
      frame = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mid = vw / 2;
      for (const rail of rails) {
        const box = rail.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) continue; // off screen: leave as it was
        for (const card of Array.from(rail.children) as HTMLElement[]) {
          if (card.classList.contains("coast-lead")) continue; // the intro is always readable
          const r = card.getBoundingClientRect();
          if (!r.width) continue;
          // Distance from the centre line in card widths, not screen widths: a phone
          // card is most of the screen, so measured against the screen no card was
          // ever near enough and the whole rail dimmed between cards.
          const d = Math.abs(r.left + r.width / 2 - mid) / r.width;
          // sharp within a quarter card of centre, eased out to nothing by 0.85 cards,
          // so a card a full card away is dim and one halfway between is half lit
          const t = Math.min(1, Math.max(0, (d - 0.25) / 0.6));
          const focus = 1 - t * t * (3 - 2 * t);
          card.style.setProperty("--focus", focus.toFixed(3));
        }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const t = window.setTimeout(measure, 900); // after fonts and images settle
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(t);
    };
  }, []);
  return null;
}
