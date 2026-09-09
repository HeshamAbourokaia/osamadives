"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { qrPath } from "./qr-svg";
import ShareButton from "./ShareButton";

const SITE = "https://www.osamadives.com";
const PHONE = 860;   // the phone breakpoint the rest of the site uses
const GAP = 500;     // milliseconds allowed between one tap and the next
const SPREAD = 44;   // pixels the taps may wander, one thumb's width

/**
 * Anything that answers a tap on its own. Three taps on a link would follow the link,
 * and three taps inside the photo viewer would close it, so the gesture only counts
 * taps that land on the page itself and would otherwise do nothing.
 */
const BUSY = 'a, button, input, textarea, select, label, summary, video, [role="button"], [contenteditable="true"], .viewer, .siderail, .siderail__scrim, .tapqr';

/**
 * Osama holds the phone out, taps the screen three times, and the code for the page
 * he is on fills the screen for the person in front of him to scan. It is his own
 * shortcut, not a button anyone has to find: the same code lives in the foot and in
 * the drawer for everyone else. The scan is counted under "tap", so the logbook shows
 * how often he actually hands the phone over.
 */
export default function TripleTapQR() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const taps = useRef<{ t: number; x: number; y: number }[]>([]);
  const closer = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onUp = (e: PointerEvent) => {
      if (window.innerWidth > PHONE) return;
      const el = e.target as Element | null;
      if (!el || typeof el.closest !== "function" || el.closest(BUSY)) { taps.current = []; return; }
      const last = taps.current[taps.current.length - 1];
      // too slow, or the thumb moved on: this is the first tap of a new try
      if (last && (e.timeStamp - last.t > GAP || Math.hypot(e.clientX - last.x, e.clientY - last.y) > SPREAD)) taps.current = [];
      taps.current.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
      if (taps.current.length < 3) return;
      taps.current = [];
      window.getSelection()?.removeAllRanges(); // three quick taps can leave a paragraph selected
      setOpen(true);
    };
    document.addEventListener("pointerup", onUp, { passive: true, capture: true });
    return () => document.removeEventListener("pointerup", onUp, { capture: true } as EventListenerOptions);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const onResize = () => { if (window.innerWidth > PHONE) close(); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closer.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;
  const url = `${SITE}/qr?s=tap&to=${path}`;
  const { size, d } = qrPath(url);
  const plain = `${SITE}${path === "/" ? "" : path}`;

  return createPortal(
    <div className="tapqr" role="dialog" aria-modal="true" aria-label="Code for this page" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="tapqr__card">
        <p className="tapqr__kicker">Point a camera here</p>
        <div className="tapqr__code">
          <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Code for ${plain}`} shapeRendering="crispEdges">
            <rect width={size} height={size} fill="#FFFDF8" />
            <path d={d} fill="#171208" />
          </svg>
          <img src="/brand/stamp-512.png" alt="" className="tapqr__stamp" width={72} height={72} />
        </div>
        <p className="tapqr__where">{plain.replace(/^https:\/\/www\./, "")}</p>
        <div className="tapqr__actions">
          <ShareButton className="tapqr__share" url={plain} label="Share" />
          <button type="button" className="tapqr__close" ref={closer} onClick={close}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
