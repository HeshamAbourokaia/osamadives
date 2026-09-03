"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageCard, { type PageData } from "./PageCard";

interface Props {
  initial: PageData[];
  total: number;
  /** Entry number of the newest review, so numbering counts down as we page. */
  topNumber: number;
}

// The wall holds one page of reviews and fetches the next on request, so a book with
// hundreds of reviews still opens fast. Any card can be opened to read it on its own.
export default function ReviewWall({ initial, total, topNumber }: Props) {
  const [entries, setEntries] = useState<PageData[]>(initial);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const more = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/logbook/list?offset=${entries.length}&limit=24`);
      const data = await res.json();
      if (Array.isArray(data.entries) && data.entries.length) {
        setEntries((prev) => [...prev, ...data.entries.filter((e: PageData) => !prev.some((p) => p.id === e.id))]);
      }
    } catch {
      /* the reader keeps what is already on screen */
    } finally {
      setBusy(false);
    }
  }, [entries.length]);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const shown = entries.length;
  const left = Math.max(0, total - shown);

  return (
    <>
      <div className="lb-grid">
        {entries.map((entry, i) => (
          <button
            key={entry.id}
            type="button"
            className="lb-open"
            aria-label={`Read the review from ${entry.name}${entry.country ? ` from ${entry.country}` : ""}`}
            onClick={(e) => {
              opener.current = e.currentTarget;
              setOpen(i);
            }}
          >
            <PageCard entry={entry} number={topNumber - i} />
          </button>
        ))}
      </div>

      {left > 0 ? (
        <div className="lb-more">
          <button type="button" className="lb-btn lb-btn--paper" onClick={more} disabled={busy}>
            {busy ? "Reading..." : `Show ${Math.min(24, left)} more`}
          </button>
          <span className="lb-mono">{shown} of {total} reviews</span>
        </div>
      ) : total > 0 ? (
        <div className="lb-more"><span className="lb-mono">All {total} reviews, every one signed</span></div>
      ) : null}

      {open !== null && entries[open] ? (
        <div className="lb-modal" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div
            className="lb-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Review from ${entries[open].name}`}
            tabIndex={-1}
            ref={dialog}
          >
            <button type="button" className="lb-modal__close" onClick={close} aria-label="Close this review">&times;</button>
            <PageCard entry={entries[open]} number={topNumber - open} variant="single" />
          </div>
        </div>
      ) : null}
    </>
  );
}
