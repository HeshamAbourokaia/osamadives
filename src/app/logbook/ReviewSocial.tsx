"use client";

import { useCallback, useEffect, useState } from "react";
import { REACTIONS } from "@/lib/logbook/types";

export interface SocialData {
  counts: Record<string, number>;
  mine: string[];
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

interface Props {
  id: string;
  name: string;
  /** Counts the wall already fetched for this card. Without it the bar fetches its own. */
  initial?: SocialData;
}

// The strip under a review: the reactions people left, with a picker for adding yours.
export default function ReviewSocial({ id, name, initial }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>(initial?.counts ?? {});
  const [mine, setMine] = useState<string[]>(initial?.mine ?? []);
  const [picker, setPicker] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (initial) {
      setCounts(initial.counts);
      setMine(initial.mine);
      return;
    }
    const device = deviceId();
    fetch(`/api/logbook/social?ids=${id}&device=${encodeURIComponent(device)}`)
      .then((r) => r.json())
      .then((d) => {
        setCounts(d.reactions?.[id] ?? {});
        setMine(d.mine?.[id] ?? []);
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
      </div>

      {picker ? (
        <div className="lb-social__picker" id={`pick-${id}`} role="group" aria-label={`React to ${name}'s review`}>
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

      {note ? <p className="lb-social__note" role="alert">{note}</p> : null}
    </div>
  );
}
