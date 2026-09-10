"use client";

import { useEffect } from "react";

// Nothing that is already something to press. The coast, the book, the sideways rails
// and the photographs keep their own gestures.
const BUSY = 'a, button, input, textarea, select, label, summary, video, [role="button"], .viewer, .siderail, .siderail__scrim, .tapqr, .flipbook, .js-rail, .coast-rail, .orbit-3d, .msgbtn';
const HOLD_MS = 380;
const SPEED = 110; // pixels a second: a slow fin kick, not a fall

/**
 * Hold to dive. Press and hold anywhere on the homepage that is not a control, and the
 * page descends on its own at a breathing pace; lift the thumb and it stops where it is.
 * Phones only. A press that moves is a scroll and is left alone; a triple tap is three
 * short presses and never reaches the hold.
 */
export default function HoldToDive() {
  useEffect(() => {
    if (!window.matchMedia("(max-width: 860px) and (pointer: coarse)").matches) return;
    let timer = 0;
    let frame = 0;
    let last = 0;
    let start: { x: number; y: number; id: number } | null = null;
    const cue = document.createElement("div");
    cue.className = "dive-cue mono";
    cue.setAttribute("aria-hidden", "true");
    cue.textContent = "diving · lift to stop";
    const stop = () => {
      window.clearTimeout(timer); timer = 0;
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      start = null;
      document.documentElement.classList.remove("is-diving");
      cue.remove();
    };
    let carry = 0; // fractions of a pixel wait for the next frame
    const step = (t: number) => {
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      carry += (SPEED * dt) / 1000;
      const px = Math.floor(carry);
      carry -= px;
      // instant, or the page's own smooth scrolling turns every frame into a crawl
      if (px) window.scrollBy({ top: px, behavior: "instant" as ScrollBehavior });
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (bottom) { stop(); return; }
      frame = requestAnimationFrame(step);
    };
    const begin = () => {
      timer = 0;
      document.documentElement.classList.add("is-diving");
      document.body.appendChild(cue);
      last = 0;
      frame = requestAnimationFrame(step);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !e.isPrimary) return;
      const el = e.target as Element | null;
      if (!el || typeof el.closest !== "function" || el.closest(BUSY)) return;
      stop();
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      timer = window.setTimeout(begin, HOLD_MS);
    };
    const onMove = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      // a thumb that travels is scrolling, not holding
      if (!frame && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) stop();
    };
    const onUp = () => stop();
    const onMenu = (e: Event) => { if (frame) e.preventDefault(); };
    document.addEventListener("pointerdown", onDown, { passive: true, capture: true });
    document.addEventListener("pointermove", onMove, { passive: true, capture: true });
    document.addEventListener("pointerup", onUp, { passive: true, capture: true });
    document.addEventListener("pointercancel", onUp, { passive: true, capture: true });
    document.addEventListener("contextmenu", onMenu);
    window.addEventListener("blur", onUp);
    return () => {
      stop();
      document.removeEventListener("pointerdown", onDown, { capture: true } as EventListenerOptions);
      document.removeEventListener("pointermove", onMove, { capture: true } as EventListenerOptions);
      document.removeEventListener("pointerup", onUp, { capture: true } as EventListenerOptions);
      document.removeEventListener("pointercancel", onUp, { capture: true } as EventListenerOptions);
      document.removeEventListener("contextmenu", onMenu);
      window.removeEventListener("blur", onUp);
    };
  }, []);
  return null;
}
