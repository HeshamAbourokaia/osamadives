"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface PickerOption { value: string; label: string; hint?: string; icon?: ReactNode }

/**
 * A wall of chips is a lot to read on a phone, and a native multi-select is worse.
 * This is the pattern a phone already knows: one row that names what you have chosen,
 * and a sheet that slides up with the whole list to tick through. It closes on Done,
 * on the scrim, or on Escape, and it can cap how many may be picked.
 */
export default function PickerSheet({
  id, label, options, value, onChange, max, placeholder = "Choose", summaryMax = 2,
}: {
  id: string;
  label: string;
  options: PickerOption[];
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  placeholder?: string;
  summaryMax?: number;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  const chosen = options.filter((o) => value.includes(o.value));
  const summary = chosen.length
    ? chosen.slice(0, summaryMax).map((o) => o.label).join(", ") + (chosen.length > summaryMax ? ` +${chosen.length - summaryMax}` : "")
    : placeholder;
  const full = max !== undefined && value.length >= max;

  // Always hand back the list in the order the options are written, so the summary,
  // the preview and the saved page all name them the same way round.
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else if (!full) {
      const next = new Set([...value, v]);
      onChange(options.filter((o) => next.has(o.value)).map((o) => o.value));
    }
  };

  return (
    <>
      <button
        type="button"
        id={id}
        className={`picker__trigger${chosen.length ? " has-value" : ""}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="picker__value">{summary}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z" /></svg>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div className="picker" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="picker__panel">
            <span className="picker__grip" aria-hidden="true" />
            <div className="picker__head">
              <h2>{label}</h2>
              <button type="button" className="picker__done" onClick={close}>Done</button>
            </div>
            {max !== undefined ? <p className="picker__note">Pick up to {max}. {value.length} chosen.</p> : null}
            <ul className="picker__list">
              {options.map((o) => {
                const on = value.includes(o.value);
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      className={`picker__opt${on ? " is-on" : ""}`}
                      aria-pressed={on}
                      aria-disabled={!on && full}
                      onClick={() => toggle(o.value)}
                    >
                      {o.icon ? <span className="picker__icon">{o.icon}</span> : null}
                      <span className="picker__opt-words">
                        <strong>{o.label}</strong>
                        {o.hint ? <small>{o.hint}</small> : null}
                      </span>
                      <span className="picker__tick" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" /></svg>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
