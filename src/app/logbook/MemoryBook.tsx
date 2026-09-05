"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  /** The pages of the book, in reading order. Server-rendered; the book only turns them. */
  pages: React.ReactNode[];
  /** Short labels for the page counter and the screen reader, one per page */
  labels: string[];
}

const TURN_MS = 720;

// A memory book. Two pages open on a desk; on a phone, one. The right-hand leaf turns
// over on its spine to show the next page (its back is the page that lands on the left),
// like flicking through a sketchbook. Arrows, a swipe, or the keyboard turn the leaves.
export default function MemoryBook({ pages, labels }: Props) {
  const n = pages.length;
  const [index, setIndex] = useState(0);          // the page open on the right
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const go = useCallback((dir: "next" | "prev") => {
    if (turn) return;
    const target = dir === "next" ? index + 1 : index - 1;
    if (target < 0 || target >= n) return;
    if (reduced) { setIndex(target); return; }
    setTurn(dir);
    timer.current = window.setTimeout(() => {
      setIndex(target);
      setTurn(null);
    }, TURN_MS);
  }, [turn, index, n, reduced]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

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

  const left = index > 0 ? pages[index - 1] : null;   // what lies open on the left
  const right = pages[index];
  const next = index + 1 < n ? pages[index + 1] : null;
  const prevLeft = index > 1 ? pages[index - 2] : null;

  return (
    <div
      className={`book${turn ? ` is-turning is-${turn}` : ""}${index === 0 ? " at-start" : ""}${index === n - 1 ? " at-end" : ""}`}
      role="region"
      aria-roledescription="book"
      aria-label={`Reviews, page ${index + 1} of ${n}: ${labels[index] ?? ""}`}
      tabIndex={0}
      onKeyDown={onKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="book__desk">
        {/* the left page: what has been read */}
        <div className="book__page book__page--left" aria-hidden={index === 0}>
          {turn === "prev" ? prevLeft : left}
          {index === 0 && !turn ? <div className="book__inside">Open me</div> : null}
        </div>

        {/* the right page: the one being read, or the one about to be */}
        <div className="book__page book__page--right">
          {turn === "next" ? next : right}
        </div>

        {/* the moving leaf. Forward: front = current right, back = current right (it lands on the left).
            Back: front = current left (as it lifts), back = current left's next page (index) landing on the right. */}
        {turn ? (
          <div className={`book__leaf book__leaf--${turn}`} aria-hidden="true">
            <div className="book__face book__face--front">{turn === "next" ? right : left}</div>
            <div className="book__face book__face--back">{turn === "next" ? right : left}</div>
          </div>
        ) : null}

        <div className="book__spine" aria-hidden="true" />
      </div>

      <div className="book__bar">
        <button type="button" className="book__btn" onClick={() => go("prev")} disabled={index === 0 || !!turn} aria-label="Previous page">
          <span aria-hidden="true">&larr;</span>
        </button>
        <span className="book__count lb-mono" aria-live="polite">
          {labels[index] ?? ""} · {index + 1} / {n}
        </span>
        <button type="button" className="book__btn" onClick={() => go("next")} disabled={index === n - 1 || !!turn} aria-label="Next page">
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
