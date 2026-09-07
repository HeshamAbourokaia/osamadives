"use client";

import { useEffect, useRef, useState } from "react";
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
  return (
    <div className="review-deck" aria-roledescription="carousel" aria-label="The book of reviews">
      <div className="deck" ref={strip}>
        {cards.map((p, i) => (
          <div key={i} className="review-deck__card">
            {p.href ? <a href={p.href} className="review-deck__link" aria-label={p.caption}>{p.node}</a> : p.node}
          </div>
        ))}
      </div>
      <div className="deck__dots" aria-hidden="true">{cards.map((_, i) => <i key={i} className={i === on ? "is-on" : ""} />)}</div>
      <p className="book__caption mono" aria-live="polite">{cards[on]?.caption}</p>
    </div>
  );
}
