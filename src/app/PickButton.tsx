"use client";

import { useEffect, useState } from "react";
import { onPicks, readPicks, togglePick, type Pick } from "@/lib/picks";

/**
 * The plus on a site or a course. One tap and it joins the message the green pill
 * sends; a second tap takes it out. The pill shows the count. Phones only, by the
 * stylesheet: a desk has the whole page and a keyboard.
 */
export default function PickButton({ id, label, kind, className = "" }: Pick & { className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = (list: Pick[]) => setOn(list.some((p) => p.id === id));
    sync(readPicks());
    return onPicks(sync);
  }, [id]);
  return (
    <button
      type="button"
      className={`pick${on ? " is-on" : ""} ${className}`.trim()}
      aria-pressed={on}
      aria-label={on ? `Take ${label} out of your message` : `Add ${label} to your message`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const { added, list } = togglePick({ id, label, kind });
        window.dispatchEvent(new CustomEvent("od:picked", { detail: { label, added, count: list.length } }));
      }}
    >
      <span className="pick__mark" aria-hidden="true">{on ? "✓" : "+"}</span>
      <span className="pick__word">{on ? "In your message" : "Add to my message"}</span>
    </button>
  );
}
