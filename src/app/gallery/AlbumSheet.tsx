"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface Album { id: string; label: string; count: number }

/**
 * Thirteen albums as thirteen buttons filled the whole first screen of the gallery,
 * so the photographs began below the fold. On a phone the albums live behind one
 * control instead: it names the album you are in, and opens a sheet listing them all
 * with their counts. A rail of chips would only trade the wall for a row nobody can
 * see the end of. The desk keeps the buttons; there is room for them there.
 */
export default function AlbumSheet({ albums, active, onPick }: { albums: Album[]; active: string; onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const here = albums.find((a) => a.id === active) ?? albums[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  return (
    <div className="albums only-mobile">
      <button type="button" className="albums__trigger" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <span className="albums__label">{here?.label}</span>
        <span className="albums__count">{here?.count}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z" /></svg>
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Albums" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="sheet__panel">
            <span className="sheet__grip" aria-hidden="true" />
            <h2 className="sheet__title">Albums</h2>
            <ul className="sheet__list">
              {albums.map((a) => (
                <li key={a.id}>
                  <button type="button" className={a.id === active ? "is-on" : undefined} onClick={() => { onPick(a.id); close(); }} aria-current={a.id === active ? "true" : undefined}>
                    <span>{a.label}</span>
                    <em>{a.count}</em>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="sheet__close" onClick={close}>Close</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
