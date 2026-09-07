"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Photo { src: string; alt: string; title?: string; location?: string }

// A phone's photo viewer: the strip is native scroll with snap, so a swipe has
// momentum; a pinch zooms the picture; the way out is a pill in the thumb zone.
export default function SwipeViewer({ photos, index, onClose }: { photos: Photo[]; index: number; onClose: () => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    const el = strip.current;
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: "auto" });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [index, onClose]);
  if (!ready) return null;
  return createPortal(
    <div className="viewer" role="dialog" aria-modal="true" aria-label="Photos">
      <div className="viewer__strip" ref={strip}>
        {photos.map((ph, i) => (
          <figure key={ph.src + i}>
            <img src={ph.src} alt={ph.alt} loading={Math.abs(i - index) < 2 ? "eager" : "lazy"} decoding="async" onClick={onClose} />
          </figure>
        ))}
      </div>
      <div className="viewer__foot">
        <p className="viewer__caption">{photos[index]?.title || ""}{photos[index]?.location ? ` · ${photos[index].location}` : ""}</p>
        <button type="button" className="viewer__close" onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
