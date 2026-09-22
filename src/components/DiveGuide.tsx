"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { FiArrowUp, FiMessageCircle, FiRotateCcw, FiX } from "react-icons/fi";
import { askJev } from "@/lib/guide/ask-jev";
import { answerFor, answerQuestion, MAX_GUIDE_LENGTH, needsReading } from "@/lib/guide/engine";
import { isExternal, safeGuideHref } from "@/lib/guide/links";
import { guideProfile } from "@/lib/guide/profile";
import type { GuideAnswer } from "@/lib/guide/types";
import "./dive-guide.css";

type Message = { role: "visitor"; text: string } | { role: "guide"; answer: GuideAnswer; reading?: boolean };
const profile = guideProfile;
const opening = (): Message[] => [{ role: "guide", answer: { id: "welcome", text: profile.welcome, suggestions: profile.suggestions } }];
const READING: GuideAnswer = { id: "reading", text: "One moment, reading that.", suggestions: [] };

/**
 * A small guide to what the site already says, for the visitor who would rather
 * ask than scroll. It answers from a reviewed list, keeps the conversation on the
 * page, and hands off to WhatsApp for anything real. When its own matching draws
 * a blank, the question goes to the site's own route, where Jev picks which
 * reviewed answer fits; the words never change. On a phone it sits at the left
 * foot of the screen, opposite the Message pill, and steps away with it while a
 * review page is open to read.
 */
export default function DiveGuide() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>(opening);
  const [previousTopic, setPreviousTopic] = useState<string>();
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const turn = useRef(0);
  const id = useId();
  const titleId = `${id}-title`;
  const privacyId = `${id}-privacy`;
  const last = messages[messages.length - 1];
  const suggestions = last?.role === "guide" ? last.answer.suggestions ?? profile.suggestions : [];

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, open]);
  useEffect(() => {
    if (!open) return;
    log.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); launcher.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function remember(answer: GuideAnswer) {
    if (profile.topics.some((t) => t.id === answer.id)) setPreviousTopic(answer.id);
  }
  // The last forty messages are enough for anyone; older ones drop off the top.
  const push = (...items: Message[]) => setMessages((current) => [...current, ...items].slice(-40));
  const settle = (answer: GuideAnswer) => setMessages((current) => current.map((m) => (m.role === "guide" && m.reading ? { role: "guide", answer } : m)));

  async function ask(value: string) {
    const text = value.trim().slice(0, MAX_GUIDE_LENGTH);
    if (!text || busy) return;
    setDraft("");
    const answer = answerQuestion(profile, text, previousTopic);
    if (!needsReading(answer)) {
      remember(answer);
      push({ role: "visitor", text }, { role: "guide", answer });
      return;
    }
    // The keywords drew a blank: show the question, a holding line, then whatever Jev
    // could place it against. If nothing, the honest fallback the keywords gave.
    const mine = ++turn.current;
    setBusy(true);
    push({ role: "visitor", text }, { role: "guide", answer: READING, reading: true });
    const picked = await askJev(text);
    if (mine !== turn.current) return;
    const found = picked ? answerFor(profile, picked, previousTopic) : null;
    const final = found ?? answer;
    remember(final);
    settle(final);
    setBusy(false);
  }
  function submit(e: FormEvent) { e.preventDefault(); void ask(draft); }
  function restart() { turn.current++; setBusy(false); setMessages(opening()); setDraft(""); setPreviousTopic(undefined); input.current?.focus(); }
  const close = () => { setOpen(false); launcher.current?.focus(); };
  const link = (href: string, label: string, key: string) => (
    <a key={key} href={href} target={isExternal(href) ? "_blank" : undefined} rel={isExternal(href) ? "noopener noreferrer" : undefined} onClick={() => { if (!isExternal(href)) setOpen(false); }}>
      {label}
    </a>
  );
  const contact = safeGuideHref(profile.contact.href, profile.contact.href);

  return (
    <div className="dive-guide" data-open={open ? "true" : "false"}>
      <button ref={launcher} type="button" className="dive-guide__launcher" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen((v) => !v)}>
        <FiMessageCircle aria-hidden="true" />
        <span>{profile.title}</span>
      </button>

      <section id={`${id}-panel`} className="dive-guide__panel" role="dialog" aria-labelledby={titleId} hidden={!open}>
        <header className="dive-guide__head">
          <Image className="dive-guide__stamp" src="/brand/stamp-512.png" alt="" width={64} height={64} />
          <div className="dive-guide__heading">
            <p>{profile.subtitle}</p>
            <h2 id={titleId}>{profile.title}</h2>
          </div>
          <button type="button" className="dive-guide__icon" aria-label="Start a new chat" title="Start a new chat" onClick={restart}><FiRotateCcw aria-hidden="true" /></button>
          <button type="button" className="dive-guide__icon" aria-label="Close" onClick={close}><FiX aria-hidden="true" /></button>
        </header>
        <div className="dive-guide__bar"><span aria-hidden="true" />Answers from this website, not a live person</div>
        <div className="dive-guide__log" ref={log} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" tabIndex={0}>
          {messages.map((m, i) => (
            <article key={i} className={`dive-guide__msg dive-guide__msg--${m.role}${m.role === "guide" && m.reading ? " dive-guide__msg--reading" : ""}`}>
              <span className="dive-guide__who">{m.role === "visitor" ? "You" : "Guide"}</span>
              <p dir="auto">{m.role === "visitor" ? m.text : m.answer.text}</p>
              {m.role === "guide" && m.answer.sources?.length ? (
                <div className="dive-guide__sources" aria-label="Where this comes from">
                  {m.answer.sources.filter((s) => safeGuideHref(s.href, profile.contact.href)).map((s) => link(s.href, s.label, s.href))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <div className="dive-guide__chips" aria-label="Suggested questions">
          {suggestions.slice(0, 5).map((q) => <button key={q} type="button" className="dive-guide__chip" disabled={busy} onClick={() => void ask(q)}>{q}</button>)}
        </div>
        <form className="dive-guide__composer" onSubmit={submit}>
          <label className="dive-guide__sr" htmlFor={`${id}-input`}>Your question</label>
          <input ref={input} id={`${id}-input`} className="dive-guide__input" type="text" value={draft} maxLength={MAX_GUIDE_LENGTH} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about a course or a reef" autoComplete="off" aria-describedby={privacyId} />
          <button className="dive-guide__send" type="submit" disabled={!draft.trim() || busy} aria-label="Send question"><FiArrowUp aria-hidden="true" /></button>
        </form>
        <footer className="dive-guide__foot">
          {contact ? <a className="dive-guide__contact" href={contact} target="_blank" rel="noopener noreferrer">{profile.contact.label}</a> : null}
          <p id={privacyId}>Questions stay on this page and nothing is stored. A question the guide cannot place is read once by a small AI model to pick the right answer from the list, and that is all it does. Nothing goes to Osama unless you open WhatsApp yourself. Please do not type personal details.</p>
          <small>Answers checked {profile.reviewed}</small>
        </footer>
      </section>
    </div>
  );
}
