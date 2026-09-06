"use client";

import { useEffect } from "react";

// Every press on a button or pill answers with a teal ripple from the point of the touch,
// the way water does. One listener for the page; the ripple is a span that removes itself.
const TARGETS = ".cta, .lb-btn, .navbtn, .peak-year-chip, .book__arrow, .fpage__open, .navsheet__wa, .lead-link, .sharecode__wa";

export default function TapRipple() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(TARGETS) as HTMLElement | null;
      if (!target) return;
      const r = target.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - r.left - size / 2}px`;
      ripple.style.top = `${e.clientY - r.top - size / 2}px`;
      target.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      window.setTimeout(() => ripple.remove(), 900); // in case the element leaves the page first
    };
    document.addEventListener("pointerdown", onDown, { passive: true, capture: true });
    return () => document.removeEventListener("pointerdown", onDown, { capture: true } as EventListenerOptions);
  }, []);
  return null;
}
