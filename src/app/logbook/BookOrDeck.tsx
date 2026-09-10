"use client";

import { useEffect, useId, useRef, useState } from "react";
import MemoryBook, { type BookPage } from "./MemoryBook";

/**
 * The book of reviews turns pages on a desk. On a phone a page turn is a fight with
 * the thumb, so the same pages become a deck: one review per card, swiped sideways
 * with snap and momentum, the name and the stamps in view without scrolling.
 */
export default function BookOrDeck(props: { pages: BookPage[] }) {
  const [phone, setPhone] = useState<boolean | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  const stripId = useId();
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const set = () => setPhone(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  useEffect(() => {
    const el = strip.current;
    if (!el || !phone) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setOn(kids.indexOf(e.target as HTMLElement)); }, { root: el, threshold: 0.6 });
    kids.forEach((k) => io.observe(k));
    return () => io.disconnect();
  }, [phone, props.pages.length]);
  if (phone === null) return null;
  if (!phone) return <MemoryBook pages={props.pages} />;
  const cards = props.pages.filter((p) => !p.hard);
  const move = (index: number) => {
    const el = strip.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: el.scrollLeft + card.getBoundingClientRect().left - el.getBoundingClientRect().left - (el.clientWidth - card.clientWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  };
  return (
    <div className="review-deck" role="region" aria-roledescription="carousel" aria-label="The book of reviews">
      {cards.length > 1 ? <p className="review-deck__hint">Swipe to explore, or use the arrows below</p> : null}
      <div className="deck" ref={strip} id={stripId}>
        {cards.map((p, i) => (
          <div key={i} className="review-deck__card" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${cards.length}`}>
            {p.node}
            {p.href ? <a href={p.href} className="review-deck__link" aria-label={`Read full story: ${p.caption}`}>Read full story <span aria-hidden="true">&nbsp;→</span></a> : null}
          </div>
        ))}
      </div>
      {cards.length > 1 ? (
        <div className="review-deck__controls">
          <button type="button" aria-label="Previous review" aria-controls={stripId} disabled={on === 0} onClick={() => move(on - 1)}>←</button>
          <span className="review-deck__count">{on + 1} / {cards.length}</span>
          <button type="button" aria-label="Next review" aria-controls={stripId} disabled={on >= cards.length - 1} onClick={() => move(on + 1)}>→</button>
        </div>
      ) : null}
      <p className="book__caption mono" aria-live="polite">{cards[on]?.caption}</p>
    </div>
  );
}
