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
  getSettings(): { disableFlipByClick: boolean };
  update(): void;
  destroy(): void;
};

// A page that fits its content: laid out at the page's width, measured, and told the book how
// far it would need to shrink. The book then applies ONE scale to every page, so the type is the
// same size on facing pages, like a printed book.
function FitPage({ children, index, report, scale }: { children: React.ReactNode; index: number; report: (i: number, s: number) => void; scale: number }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const b = box.current, i = inner.current;
    if (!b || !i) return;
    const fit = () => {
      const bh = b.clientHeight, ih = i.scrollHeight;
      // measure at the page's own width, unscaled, so the number does not chase itself
      const s = ih > bh && ih > 0 && bh > 0 ? Math.max(0.55, bh / ih) : 1;
      report(index, s);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    i.querySelectorAll("img").forEach((img) => img.addEventListener("load", fit));
    return () => ro.disconnect();
  }, [index, report]);
  return (
    <div className="fpage__fit" ref={box}>
      <div className="fpage__fit-measure" ref={inner} aria-hidden="true">{children}</div>
      <div className="fpage__fit-inner" style={{ transform: `scale(${scale.toFixed(4)})`, width: `${(100 / scale).toFixed(3)}%` }}>{children}</div>
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
  const n = pages.length;
  const [scales, setScales] = useState<Record<number, number>>({});
  const [narrow, setNarrow] = useState(false);
  const report = useCallback((i: number, s: number) => { setScales((prev) => (prev[i] === s ? prev : { ...prev, [i]: s })); }, []);
  const uniform = Math.min(1, ...Object.values(scales));

  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;
    let alive = true;
    let pf: Flip | null = null;
    import("page-flip").then(({ PageFlip }) => {
      if (!alive || !el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // On a phone the book shows one page, taller than the desk's. The engine's mobile
      // scroll support keeps a finger moving up or down the paper scrolling the page;
      // a sideways swipe or a corner drag turns the page.
      const phone = window.matchMedia("(max-width: 860px)").matches;
      setNarrow(phone);
      pf = new (PageFlip as unknown as new (el: HTMLElement, s: Record<string, unknown>) => Flip)(el, {
        width: phone ? 340 : 440, height: phone ? 560 : 600,
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

  // Turning back. The engine's flipPrev aims at a point ten pixels from the left of a
  // two-page spread; in the phone's one-page mode that point lands mid-book and the
  // "no flip by click" guard rejects it, so the guard is lifted for the one call.
  const flipBack = useCallback(() => {
    const pf = flip.current;
    if (!pf) return;
    const s = pf.getSettings();
    const keep = s.disableFlipByClick;
    s.disableFlipByClick = false;
    try { pf.flipPrev(); } finally { s.disableFlipByClick = keep; }
  }, []);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); flip.current?.flipNext(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); flipBack(); }
  };
  // On a phone the engine's own swipe turns pages forward; a swipe back reaches the same
  // guard, so the book reads that one itself.
  const touch = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY, t: Date.now() }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const from = touch.current; touch.current = null;
    const t = e.changedTouches[0];
    if (!from || !t || !narrow) return;
    const dx = t.clientX - from.x, dy = Math.abs(t.clientY - from.y);
    if (dx > 48 && dy < 60 && Date.now() - from.t < 500) flipBack();
  };
  // A tap opens the page. The browser only fires a click for a press that did not travel,
  // so a drag or a swipe never lands here. It is read at the book, not on the page: on a
  // phone the engine shows a clone of each page, and a clone carries no handlers of its own.
  const onBookClick = (e: React.MouseEvent) => {
    const page = (e.target as Element).closest<HTMLElement>(".fpage");
    if (!page) return;
    const i = Number(page.dataset.idx);
    if (Number.isFinite(i) && !pages[i]?.hard) setOpen(i);
  };

  const right = flip.current?.getOrientation() === "landscape" ? Math.min(n - 1, index % 2 === 0 ? index + 1 : index) : index;
  const captionIdx = index === 0 ? 0 : right;
  const caption = pages[captionIdx]?.caption ?? "";

  return (
    <div className="flipbook" role="region" aria-roledescription="book" aria-label={`Reviews, ${caption}`} tabIndex={0} onKeyDown={onKey}>
      <span className="book__ghost" aria-hidden="true">Reviews</span>
      <button type="button" className="book__arrow book__arrow--prev lg" onClick={flipBack} disabled={!ready || index === 0} aria-label="Previous page">&#8249;</button>
      <button type="button" className="book__arrow book__arrow--next lg" onClick={() => flip.current?.flipNext()} disabled={!ready || index >= n - 1} aria-label="Next page">&#8250;</button>

      <div className="flipbook__stage">
        <div className="flipbook__book" ref={bookRef} onClick={onBookClick} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {pages.map((pg, i) => (
            <div
              className={`fpage${pg.hard ? " fpage--hard" : ""}`}
              data-density={pg.hard ? "hard" : "soft"}
              data-idx={i}
              key={i}
            >
              <div className="fpage__paper">
                <FitPage index={i} report={report} scale={pg.hard ? 1 : uniform}>{pg.node}</FitPage>
              </div>
              {!pg.hard ? (
                <button type="button" className="fpage__open lg" aria-label={`Open ${pg.caption}`}>Open page</button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <p className="book__caption lb-mono" aria-live="polite">
        <span>{caption}</span>
        <span className="book__count">{Math.min(n, captionIdx + 1)} / {n}</span>
        <span className="book__hint">{narrow ? "Swipe to turn a page, tap to read it" : "Drag a corner, or use the arrows"}</span>
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
