"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface BookPage {
  node: React.ReactNode;
  caption: string;
  /** where "Open" goes for this page, if it has its own page on the site */
  href?: string;
  /** covers are stiff; inner pages bend */
  hard?: boolean;
}

interface Props {
  pages: BookPage[];
}

type Flip = {
  loadFromHTML(items: NodeListOf<Element> | Element[]): void;
  on(event: string, cb: (e: { data: unknown }) => void): void;
  flipNext(): void;
  flipPrev(): void;
  getCurrentPageIndex(): number;
  getPageCount(): number;
  getOrientation(): "portrait" | "landscape";
  update(): void;
  destroy(): void;
};

// A page that fits its content: laid out at the page's width, measured, scaled down if it
// would run past the bottom. No scrolling inside a page.
function FitPage({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const b = box.current, i = inner.current;
    if (!b || !i) return;
    const fit = () => {
      const bh = b.clientHeight, ih = i.scrollHeight;
      setScale(ih > bh && ih > 0 ? Math.max(0.55, bh / ih) : 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b); ro.observe(i);
    i.querySelectorAll("img").forEach((img) => img.addEventListener("load", fit));
    return () => ro.disconnect();
  }, []);
  return (
    <div className="fpage__fit" ref={box}>
      <div className="fpage__fit-inner" ref={inner} style={{ transform: `scale(${scale.toFixed(4)})`, width: `${(100 / scale).toFixed(3)}%` }}>{children}</div>
    </div>
  );
}

// The memory book. A real page-curl engine (page-flip) drives it: drag a corner with a
// finger or the mouse and the paper bends and follows, stops where you stop, and settles
// over or back when you let go. Arrows and the keyboard turn pages too. A click or a
// double tap on a page, or its Open pill, shows that page large.
export default function MemoryBook({ pages }: Props) {
  const bookRef = useRef<HTMLDivElement>(null);
  const flip = useRef<Flip | null>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const down = useRef<{ x: number; y: number; t: number } | null>(null);
  const n = pages.length;

  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;
    let alive = true;
    let pf: Flip | null = null;
    import("page-flip").then(({ PageFlip }) => {
      if (!alive || !el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      pf = new (PageFlip as unknown as new (el: HTMLElement, s: Record<string, unknown>) => Flip)(el, {
        width: 440, height: 600,
        size: "stretch", minWidth: 240, maxWidth: 560, minHeight: 330, maxHeight: 760,
        showCover: true, usePortrait: true, mobileScrollSupport: true,
        drawShadow: true, maxShadowOpacity: 0.55,
        flippingTime: reduced ? 1 : 900,
        useMouseEvents: true, swipeDistance: 24,
        disableFlipByClick: true,     // a click opens the page; a drag turns it
        showPageCorners: true,
      });
      pf.loadFromHTML(el.querySelectorAll(".fpage"));
      pf.on("flip", (e) => setIndex(Number(e.data) || 0));
      flip.current = pf;
      setReady(true);
    });
    return () => { alive = false; try { pf?.destroy(); } catch { /* already gone */ } flip.current = null; };
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); flip.current?.flipNext(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); flip.current?.flipPrev(); }
  };
  // A press that does not travel is a click: open the page. A press that travels is the engine's drag.
  const onPointerDown = (e: React.PointerEvent) => { down.current = { x: e.clientX, y: e.clientY, t: Date.now() }; };
  const onPointerUp = useCallback((i: number) => (e: React.PointerEvent) => {
    const d = down.current; down.current = null;
    if (!d) return;
    const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
    if (moved < 6 && Date.now() - d.t < 500 && !pages[i].hard) setOpen(i);
  }, [pages]);

  const right = flip.current?.getOrientation() === "landscape" ? Math.min(n - 1, index % 2 === 0 ? index + 1 : index) : index;
  const captionIdx = index === 0 ? 0 : right;
  const caption = pages[captionIdx]?.caption ?? "";

  return (
    <div className="flipbook" role="region" aria-roledescription="book" aria-label={`Reviews, ${caption}`} tabIndex={0} onKeyDown={onKey}>
      <span className="book__ghost" aria-hidden="true">Reviews</span>
      <button type="button" className="book__arrow book__arrow--prev lg" onClick={() => flip.current?.flipPrev()} disabled={!ready || index === 0} aria-label="Previous page">&#8249;</button>
      <button type="button" className="book__arrow book__arrow--next lg" onClick={() => flip.current?.flipNext()} disabled={!ready || index >= n - 1} aria-label="Next page">&#8250;</button>

      <div className="flipbook__stage">
        <div className="flipbook__book" ref={bookRef}>
          {pages.map((pg, i) => (
            <div
              className={`fpage${pg.hard ? " fpage--hard" : ""}`}
              data-density={pg.hard ? "hard" : "soft"}
              key={i}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp(i)}
              onDoubleClick={() => { if (!pg.hard) setOpen(i); }}
            >
              <div className="fpage__paper">
                <FitPage>{pg.node}</FitPage>
              </div>
              {!pg.hard ? (
                <button type="button" className="fpage__open lg" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setOpen(i); }} aria-label={`Open ${pg.caption}`}>Open</button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <p className="book__caption lb-mono" aria-live="polite">
        <span>{caption}</span>
        <span className="book__count">{Math.min(n, captionIdx + 1)} / {n}</span>
        <span className="book__hint">Drag a corner, or use the arrows</span>
      </p>

      {open !== null ? (
        <div className="lb-modal" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className="lb-modal__panel" role="dialog" aria-modal="true" aria-label={pages[open].caption} tabIndex={-1}>
            <button type="button" className="lb-modal__close" onClick={() => setOpen(null)} aria-label="Close">&times;</button>
            <div className="flipbook__big">{pages[open].node}</div>
            {pages[open].href ? (
              <p className="flipbook__biglink"><a href={pages[open].href} className="lb-btn lb-btn--paper">Open this page on the site</a></p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
