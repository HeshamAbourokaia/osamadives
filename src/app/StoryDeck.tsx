"use client";

import { useEffect, useRef, useState } from "react";

export interface StoryItem { href: string; title: string; kicker: string; text: string; image: string; alt: string }

/**
 * Stories, the way a phone already knows them: full-screen cards, one item each,
 * a strong photograph, progress marks along the top. Swipe to move between them,
 * tap the right third to go on and the left third to go back. Native scroll with
 * snap points does the moving, so it has momentum and costs nothing to animate.
 */
export default function StoryDeck({ items, share }: { items: StoryItem[]; share: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setOn(kids.indexOf(e.target as HTMLElement)); }, { root: el, threshold: 0.6 });
    kids.forEach((k) => io.observe(k));
    return () => io.disconnect();
  }, [items.length]);

  const go = (d: number) => {
    const el = strip.current;
    if (!el) return;
    const next = Math.min(items.length - 1, Math.max(0, on + d));
    el.scrollTo({ left: next * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="story-deck only-mobile" aria-roledescription="carousel" aria-label={share}>
      <div className="story-deck__bar" aria-hidden="true">
        {items.map((_, i) => <i key={i} className={i === on ? "is-on" : i < on ? "is-done" : ""} />)}
      </div>
      <span className="story-deck__hint" aria-hidden="true">{on + 1} of {items.length} · swipe</span>
      <button type="button" className="story-deck__tap story-deck__tap--prev" aria-label="Previous" onClick={() => go(-1)} />
      <button type="button" className="story-deck__tap story-deck__tap--next" aria-label="Next" onClick={() => go(1)} />
      <div className="deck" ref={strip}>
        {items.map((it, i) => (
          <article className="story" key={it.href} aria-label={it.title}>
            <img className="story__img" src={it.image} alt={it.alt} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
            <div className="story__scrim" aria-hidden="true" />
            <div className="story__copy">
              <span className="story__kicker">{it.kicker}</span>
              <h2 className="story__title">{it.title}</h2>
              <p className="story__text">{it.text}</p>
              <div className="story__row">
                <a className="story__open" href={it.href}>Read</a>
                <a className="story__share" href={`https://wa.me/?text=${encodeURIComponent(`${it.title} https://www.osamadives.com${it.href}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Share ${it.title} on WhatsApp`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 1.8a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 0 1 12 4.8zm-2.6 3.6c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.6-.4h-.4z" /></svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
