"use client";

import { useEffect, useRef } from "react";
import { clearPicks, composeMessage, QUICK_QUESTIONS, removePick, whatsappFor, type Pick } from "@/lib/picks";

/**
 * Hold the green pill and this rises: the message so far, with each pick removable,
 * and four questions people actually ask first, each one a WhatsApp message ready to
 * send. Nothing here sells anything; it starts a conversation with the right words.
 */
export default function AskSheet({ picks, level, onClose, onSend }: { picks: Pick[]; level?: string | null; onClose: () => void; onSend?: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  const text = composeMessage(picks, level);
  return (
    <div className="ask" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ask__panel" role="dialog" aria-modal="true" aria-label="Ask Osama" ref={panel}>
        <span className="ask__grip" aria-hidden="true" />
        <div className="ask__head">
          <span className="ask__kicker mono">WhatsApp · he answers himself</span>
          <h2 className="ask__title">Ask Osama</h2>
        </div>
        {picks.length ? (
          <div className="ask__picks">
            <span className="ask__label mono">In your message</span>
            <ul className="ask__chips">
              {picks.map((p) => (
                <li key={p.id}>
                  <button type="button" className="ask__chip" onClick={() => removePick(p.id)} aria-label={`Take ${p.label} out`}>
                    {p.label} <span aria-hidden="true">&times;</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="ask__preview">{text}</p>
            <a className="ask__send" href={whatsappFor(text)} target="_blank" rel="noopener noreferrer" onClick={() => { onSend?.(); onClose(); }}>Send it on WhatsApp</a>
            <button type="button" className="ask__fresh" onClick={() => clearPicks()}>Start a fresh message</button>
          </div>
        ) : null}
        <div className="ask__quick">
          <span className="ask__label mono">{picks.length ? "Or ask something else" : "Quick questions"}</span>
          <ul className="ask__list">
            {QUICK_QUESTIONS.map((q) => (
              <li key={q}>
                <a href={whatsappFor(`Hi Osama! I found you on osamadives.com. ${q}`)} target="_blank" rel="noopener noreferrer" onClick={onClose}>{q}</a>
              </li>
            ))}
          </ul>
        </div>
        <p className="ask__foot">Tap a site or a course anywhere on the site and it joins your message. Once it is sent, the next message starts fresh; one that is never sent clears itself after a few hours. Courses and dives are arranged through CDWS-registered dive centres in Dahab.</p>
        <button type="button" className="ask__close" onClick={onClose} aria-label="Close">&times;</button>
      </div>
    </div>
  );
}
