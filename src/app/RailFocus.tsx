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
        const rulerId = rail.getAttribute("data-ruler");
        if (box.bottom < 0 || box.top > vh) {
          // off screen: leave the cards as they were
          continue;
        }
        let best: HTMLElement | null = null;
        let bestFocus = 0;
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
          if (focus > bestFocus) { bestFocus = focus; best = card; }
        }
        // The site in focus lights its depth on the ruler.
        // A card with no depth (the morning photograph) keeps the previous site lit.
        if (rulerId && best && bestFocus > 0.3) {
          const depth = best.getAttribute("data-depth");
          const name = best.querySelector("h3")?.textContent?.trim();
          const ruler = document.getElementById(rulerId);
          if (depth && name && ruler && ruler.getAttribute("data-site") !== name) {
            const [lo, hi] = depth.split(" ").map(Number);
            ruler.style.setProperty("--lo", String(lo));
            ruler.style.setProperty("--hi", String(Math.min(hi, 30)));
            ruler.setAttribute("data-site", name);
            ruler.setAttribute("data-deep", hi > 30 ? "1" : "0");
            const site = document.getElementById(rulerId + "-site");
            if (site) site.textContent = name;
          }
        }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    // capture: a swiped rail scrolls itself, and that scroll never reaches window
    document.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    const t = window.setTimeout(measure, 900); // after fonts and images settle
    return () => {
      document.removeEventListener("scroll", schedule, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(t);
    };
  }, []);
  return null;
}
