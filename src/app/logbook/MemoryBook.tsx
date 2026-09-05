"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface Props {
  /** The pages of the book, in reading order. Server-rendered; the book only turns them. */
  pages: React.ReactNode[];
  /** One caption per page, printed under the book in spaced caps */
  captions: string[];
}

const TURN_MS = 820;

// A page that fits its content to the page: the card is laid out at the page's width,
// measured, and scaled down if it would run past the bottom. No inner scrolling.
function FitPage({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const b = box.current, i = inner.current;
    if (!b || !i) return;
    const fit = () => {
      const bh = b.clientHeight, ih = i.scrollHeight;
      setScale(ih > bh && ih > 0 ? Math.max(0.72, bh / ih) : 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b); ro.observe(i);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="book__fit" ref={box}>
      <div className="book__fit-inner" ref={inner} style={{ transform: `scale(${scale.toFixed(4)})`, width: `${(100 / scale).toFixed(3)}%` }}>{children}</div>
    </div>
  );
}

// A memory book, photographed from above. On a desk two pages lie open; a phone shows one.
// Turning lifts the right-hand leaf on its spine; the back of that leaf is the next page,
// so every page appears exactly once, the way a bound book reads.
export default function MemoryBook({ pages, captions }: Props) {
  const n = pages.length;
  const [narrow, setNarrow] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Desktop: spread k shows page 2k-1 on the left and 2k on the right (spread 0 = cover alone).
  // Phone: page i alone.
  const [pos, setPos] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const touchX = useRef<number | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { setNarrow(mq.matches); setReduced(rm.matches); };
    apply();
    mq.addEventListener("change", apply); rm.addEventListener("change", apply);
    return () => { mq.removeEventListener("change", apply); rm.removeEventListener("change", apply); };
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const last = narrow ? n - 1 : Math.ceil((n - 1) / 2);
  const rightIdx = narrow ? pos : pos * 2;
  const leftIdx = narrow ? -1 : pos * 2 - 1;
  const page = (i: number) => (i >= 0 && i < n ? <FitPage key={i}>{pages[i]}</FitPage> : null);

  const go = useCallback((dir: "next" | "prev") => {
    if (turn) return;
    const target = dir === "next" ? pos + 1 : pos - 1;
    if (target < 0 || target > last) return;
    if (reduced) { setPos(target); return; }
    setTurn(dir);
    timer.current = window.setTimeout(() => { setPos(target); setTurn(null); }, TURN_MS);
  }, [turn, pos, last, reduced]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go("next"); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go("prev"); }
  };
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) go(dx < 0 ? "next" : "prev");
  };

  // What each surface shows while a leaf is in the air.
  const step = narrow ? 1 : 2;
  const leafFront = turn === "next" ? rightIdx : leftIdx;                     // lifts away
  const leafBack = turn === "next" ? rightIdx + 1 : leftIdx - 1;              // lands
  const underLeft = turn === "next" ? leftIdx : leftIdx - step;               // what shows on the left during the turn
  const underRight = turn === "next" ? rightIdx + step : rightIdx;            // what shows on the right during the turn
  const showLeft = turn ? underLeft : leftIdx;
  const showRight = turn ? underRight : rightIdx;
  const caption = captions[rightIdx] ?? "";

  return (
    <div
      className={`book${turn ? ` is-turning is-${turn}` : ""}`}
      role="region"
      aria-roledescription="book"
      aria-label={`Reviews, ${caption}, ${pos + 1} of ${last + 1}`}
      tabIndex={0}
      onKeyDown={onKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <span className="book__ghost" aria-hidden="true">Reviews</span>
      <button type="button" className="book__arrow book__arrow--prev" onClick={() => go("prev")} disabled={pos === 0 || !!turn} aria-label="Previous page">&#8249;</button>
      <button type="button" className="book__arrow book__arrow--next" onClick={() => go("next")} disabled={pos === last || !!turn} aria-label="Next page">&#8250;</button>

      <div className="book__object">
        <div className="book__page book__page--left" aria-hidden={showLeft < 0}>
          {showLeft >= 0 ? page(showLeft) : <div className="book__inside" />}
        </div>
        <div className="book__page book__page--right">
          {page(showRight)}
        </div>
        {turn ? (
          <div className={`book__leaf book__leaf--${turn}`} aria-hidden="true">
            <div className="book__face book__face--front">{page(leafFront)}</div>
            <div className="book__face book__face--back">{leafBack >= 0 && leafBack < n ? page(leafBack) : <div className="book__inside" />}</div>
          </div>
        ) : null}
        <div className="book__spine" aria-hidden="true" />
      </div>

      <p className="book__caption lb-mono" aria-live="polite">
        <span>{caption}</span>
        <span className="book__count">{pos + 1} / {last + 1}</span>
      </p>
    </div>
  );
}
