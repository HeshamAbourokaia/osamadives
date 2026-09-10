"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WHATSAPP } from "@/lib/contact";
import { composeMessage, onPicks, readPicks, whatsappFor, type Pick } from "@/lib/picks";
import { levelSays, onLevel, readLevel, type Level } from "@/lib/level";
import AskSheet from "./AskSheet";

/**
 * The one thing to do, and nothing else beside it. The coastline on the edge carries
 * where to go, so the foot of the screen is free for the single action the whole site
 * leads to. WhatsApp because it is what people in Egypt actually answer.
 *
 * It also carries the message being built: every site or course somebody adds joins
 * the words it sends, and the count shows on the pill. A tap sends; a hold opens the
 * sheet with the message so far and the questions people ask first.
 */
export default function MessageButton() {
  // Reading down the page, the pill steps away so it never covers a line; the moment
  // the thumb stops, or comes back up, so does the pill.
  const [away, setAway] = useState(false);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [sheet, setSheet] = useState(false);
  const [level, setLevel] = useState<Level | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const hold = useRef(0);
  const held = useRef(false);
  useEffect(() => {
    let last = window.scrollY;
    let still = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      last = y;
      window.clearTimeout(still);
      if (dy > 6 && y > 160) setAway(true);
      else if (dy < -6) setAway(false);
      still = window.setTimeout(() => setAway(false), 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.clearTimeout(still); };
  }, []);
  useEffect(() => {
    setPicks(readPicks());
    const off = onPicks(setPicks);
    setLevel(readLevel());
    const offLevel = onLevel(setLevel);
    let t = 0;
    const onPicked = (e: Event) => {
      const d = (e as CustomEvent<{ label: string; added: boolean; count: number }>).detail;
      setToast(d.added ? `${d.label} added · ${d.count} in your message` : `${d.label} taken out${d.count ? ` · ${d.count} left` : ""}`);
      window.clearTimeout(t);
      t = window.setTimeout(() => setToast(null), 2200);
    };
    window.addEventListener("od:picked", onPicked);
    return () => { off(); offLevel(); window.removeEventListener("od:picked", onPicked); window.clearTimeout(t); };
  }, []);
  const close = useCallback(() => setSheet(false), []);
  const href = picks.length || level ? whatsappFor(composeMessage(picks, levelSays(level))) : WHATSAPP;
  const startHold = () => { held.current = false; window.clearTimeout(hold.current); hold.current = window.setTimeout(() => { held.current = true; setSheet(true); }, 480); };
  const endHold = () => window.clearTimeout(hold.current);
  return (
    <>
      {toast ? <div className="msgtoast mono" role="status">{toast}</div> : null}
      <a
        className={`msgbtn${away && !toast ? " is-away" : ""}${picks.length ? " has-picks" : ""}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={picks.length ? `Message Osama on WhatsApp, ${picks.length} in your message. Hold for the message and quick questions.` : "Message Osama on WhatsApp. Hold for quick questions."}
        data-analytics-event="whatsapp_click"
        data-analytics-category="conversion"
        data-analytics-label="Message Osama"
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchMove={endHold}
        onTouchCancel={endHold}
        onContextMenu={(e) => { if (held.current) e.preventDefault(); }}
        onClick={(e) => { if (held.current) { e.preventDefault(); held.current = false; } }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 1.8a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 0 1 12 4.8zm-2.6 3.6c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.6-.4h-.4z" /></svg>
        <span>Message</span>
        {picks.length ? <span className="msgbtn__count" aria-hidden="true">{picks.length}</span> : null}
      </a>
      {sheet ? <AskSheet picks={picks} level={levelSays(level)} onClose={close} /> : null}
    </>
  );
}
