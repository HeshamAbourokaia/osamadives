"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ShareButton from "@/app/ShareButton";

interface Photo { src: string; alt: string; title?: string; location?: string; description?: string; date?: string }

const SITE = "https://www.osamadives.com";

// The caption under an enlarged photo: his own words where he wrote some, otherwise
// the place and the year only. Nothing is made up for a photo without a note.
function captionFor(ph: Photo) {
  if (ph.description) return ph.description;
  const year = ph.date ? new Date(ph.date).getFullYear() : null;
  return [ph.location, Number.isFinite(year) ? String(year) : null].filter(Boolean).join(" · ");
}

/**
 * A phone's photo viewer. The strip is native scroll with snap, so a swipe has
 * momentum and a pinch zooms; swipe down, tap the picture or press Close to leave;
 * one tap shares the photo on WhatsApp. It opens on the photo that was tapped: the
 * strip only exists after the portal has mounted, so the jump to that photo waits
 * for it rather than firing into an empty ref.
 */
export default function SwipeViewer({ photos, index, onClose }: { photos: Photo[]; index: number; onClose: () => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(index);
  const touch = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    const el = strip.current;
    if (!ready || !el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "auto" });
    setOn(index);
    const onScroll = () => setOn(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ready, index]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  if (!ready) return null;
  const ph = photos[on] || photos[index];
  return createPortal(
    <div className="viewer" role="dialog" aria-modal="true" aria-label="Photos">
      <div
        className="viewer__strip"
        ref={strip}
        onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          const t = touch.current; touch.current = null;
          if (!t) return;
          const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y;
          if (dy > 90 && Math.abs(dx) < 60) onClose(); // a swipe down closes
        }}
      >
        {photos.map((p, i) => (
          <figure key={p.src + i}>
            <img src={p.src} alt={p.alt} loading={Math.abs(i - index) < 2 ? "eager" : "lazy"} decoding="async" onClick={onClose} />
          </figure>
        ))}
      </div>
      <div className="viewer__foot">
        <div className="viewer__words">
          {ph?.title ? <strong className="viewer__title">{ph.title}</strong> : null}
          <p className="viewer__caption">{ph ? captionFor(ph) : ""}</p>
        </div>
        <div className="viewer__actions">
          <ShareButton className="viewer__share" url={`${SITE}${ph?.src || "/gallery"}`} title={ph?.title} label="Share" />
          <button type="button" className="viewer__close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
