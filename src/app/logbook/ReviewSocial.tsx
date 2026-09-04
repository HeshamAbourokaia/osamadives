"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LIMITS, REACTIONS } from "@/lib/logbook/types";

export interface SocialData {
  counts: Record<string, number>;
  mine: string[];
  comments: number;
}

interface PublicComment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

// The browser makes itself a random id the first time it needs one and keeps it in localStorage.
// It only tells one phone from another, so a reaction can be taken back from the same phone.
// No account, no cookie, nothing that names a person. Private windows get an id for the visit.
let sessionOnly = "";
export function deviceId(): string {
  const fresh = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  try {
    let id = localStorage.getItem("od_device");
    if (!id) {
      id = fresh();
      localStorage.setItem("od_device", id);
    }
    return id;
  } catch {
    if (!sessionOnly) sessionOnly = fresh();
    return sessionOnly;
  }
}

const remembered = (key: string) => {
  try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
};
const remember = (key: string, v: string) => {
  try { localStorage.setItem(key, v); } catch { /* private window */ }
};

function ago(iso: string): string {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

interface Props {
  id: string;
  name: string;
  /** Counts the wall already fetched for this card. Without it the bar fetches its own. */
  initial?: SocialData;
}

// The strip under a review: reactions with counts, a picker, and a short conversation.
export default function ReviewSocial({ id, name, initial }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>(initial?.counts ?? {});
  const [mine, setMine] = useState<string[]>(initial?.mine ?? []);
  const [commentCount, setCommentCount] = useState(initial?.comments ?? 0);
  const [picker, setPicker] = useState(false);
  const [talk, setTalk] = useState(false);
  const [comments, setComments] = useState<PublicComment[] | null>(null);
  const [note, setNote] = useState("");
  const [who, setWho] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initial) {
      setCounts(initial.counts);
      setMine(initial.mine);
      setCommentCount(initial.comments);
      return;
    }
    const device = deviceId();
    fetch(`/api/logbook/social?ids=${id}&device=${encodeURIComponent(device)}`)
      .then((r) => r.json())
      .then((d) => {
        setCounts(d.reactions?.[id] ?? {});
        setMine(d.mine?.[id] ?? []);
        setCommentCount(d.comments?.[id] ?? 0);
      })
      .catch(() => { /* the card still reads fine without its counts */ });
  }, [id, initial]);

  useEffect(() => {
    if (!picker) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPicker(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [picker]);

  const react = useCallback(async (emoji: string) => {
    const wasOn = mine.includes(emoji);
    // Show it at once; put it back if the server says no.
    setMine((m) => (wasOn ? m.filter((e) => e !== emoji) : [...m, emoji]));
    setCounts((c) => ({ ...c, [emoji]: Math.max(0, (c[emoji] ?? 0) + (wasOn ? -1 : 1)) }));
    setNote("");
    try {
      const res = await fetch(`/api/logbook/${id}/react`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ emoji, device: deviceId() }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || "no");
      setMine((m) => (d.on ? (m.includes(emoji) ? m : [...m, emoji]) : m.filter((e) => e !== emoji)));
      setCounts((c) => ({ ...c, [emoji]: d.count }));
    } catch (e) {
      setMine((m) => (wasOn ? [...m, emoji] : m.filter((x) => x !== emoji)));
      setCounts((c) => ({ ...c, [emoji]: Math.max(0, (c[emoji] ?? 0) + (wasOn ? 1 : -1)) }));
      setNote(e instanceof Error && e.message !== "no" ? e.message : "That did not save. Try again.");
    }
  }, [id, mine]);

  const openTalk = useCallback(async () => {
    const next = !talk;
    setTalk(next);
    if (!next || comments !== null) return;
    if (!who) setWho(remembered("od_name"));
    try {
      const res = await fetch(`/api/logbook/${id}/comments`);
      const d = await res.json();
      setComments(Array.isArray(d.comments) ? d.comments : []);
    } catch {
      setComments([]);
    }
  }, [talk, comments, id, who]);

  const send = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setNote("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/logbook/${id}/comments`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: who, text, website: form.get("website") || "", device: deviceId() }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || "That did not send. Try again.");
      remember("od_name", who);
      setText("");
      setSent(true);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "That did not send. Try again.");
    } finally {
      setSending(false);
    }
  }, [id, sending, who, text]);

  const shown = REACTIONS.filter((e) => (counts[e] ?? 0) > 0 || mine.includes(e));

  return (
    <div className="lb-social" data-id={id}>
      <div className="lb-social__row">
        {shown.map((e) => (
          <button
            key={e}
            type="button"
            className="lb-react"
            aria-pressed={mine.includes(e)}
            aria-label={`${e} ${counts[e] ?? 0}${mine.includes(e) ? ", yours, tap to take it back" : ", tap to add yours"}`}
            onClick={() => react(e)}
          >
            <span className="lb-react__emoji" aria-hidden="true">{e}</span>
            <span className="lb-react__n">{counts[e] ?? 0}</span>
          </button>
        ))}
        <button
          type="button"
          className={`lb-react lb-react--word${picker ? " is-open" : ""}`}
          aria-expanded={picker}
          aria-controls={`pick-${id}`}
          onClick={() => setPicker((p) => !p)}
        >
          {picker ? "Done" : shown.length ? "+" : "React"}
        </button>
        <button
          type="button"
          className={`lb-react lb-react--word${talk ? " is-open" : ""}`}
          aria-expanded={talk}
          aria-controls={`talk-${id}`}
          onClick={openTalk}
        >
          <span aria-hidden="true">💬</span> {commentCount ? `${commentCount} ${commentCount === 1 ? "comment" : "comments"}` : "Comment"}
        </button>
      </div>

      {picker ? (
        <div className="lb-social__picker" id={`pick-${id}`} role="group" aria-label={`React to ${name}'s review`} ref={pickerRef}>
          {REACTIONS.map((e) => (
            <button
              key={e}
              type="button"
              className="lb-react lb-react--pick"
              aria-pressed={mine.includes(e)}
              aria-label={`${e}${mine.includes(e) ? ", yours" : ""}`}
              onClick={() => react(e)}
            >
              {e}
            </button>
          ))}
        </div>
      ) : null}

      {talk ? (
        <div className="lb-social__talk" id={`talk-${id}`}>
          {comments === null ? (
            <p className="lb-mono lb-social__hint">Reading...</p>
          ) : comments.length ? (
            <ul className="lb-talk">
              {comments.map((c) => (
                <li key={c.id} className="lb-talk__item">
                  <span className="lb-talk__who">{c.name} <span className="lb-mono">{ago(c.createdAt)}</span></span>
                  <p>{c.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lb-mono lb-social__hint">Nothing here yet. Say something to {name}.</p>
          )}
          {sent ? (
            <p className="lb-social__sent" role="status">Sent. Osama reads it first, then it shows here.</p>
          ) : (
            <form className="lb-talk__form" onSubmit={send}>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="lb-talk__trap" />
              <input
                className="lb-talk__input"
                type="text"
                name="name"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                placeholder="Your name"
                maxLength={LIMITS.name.max}
                autoComplete="name"
                required
                aria-label="Your name"
              />
              <textarea
                className="lb-talk__input"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`A few words for ${name}`}
                maxLength={LIMITS.comment.max}
                rows={2}
                required
                aria-label={`Your comment on ${name}'s review`}
              />
              <div className="lb-talk__foot">
                <span className="lb-mono">{text.length} / {LIMITS.comment.max}</span>
                <button type="submit" className="lb-btn lb-btn--paper" disabled={sending}>
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}

      {note ? <p className="lb-social__note" role="alert">{note}</p> : null}
    </div>
  );
}
