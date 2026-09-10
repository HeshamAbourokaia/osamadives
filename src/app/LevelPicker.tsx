"use client";

import { useEffect, useState } from "react";
import { LEVELS, onLevel, readLevel, writeLevel, type Level } from "@/lib/level";

/**
 * Set your level once. Four words, one tap, remembered on the phone; the sites then say
 * whether they are for you, and the message the pill sends says it too.
 */
export default function LevelPicker({ compact = false }: { compact?: boolean }) {
  const [level, setLevel] = useState<Level | null>(null);
  useEffect(() => { setLevel(readLevel()); return onLevel(setLevel); }, []);
  return (
    <div className={`level${compact ? " level--compact" : ""}`} role="group" aria-label="Your level">
      <span className="level__k mono">Your level</span>
      <div className="level__row">
        {LEVELS.map((l) => (
          <button key={l.id} type="button" className={`level__btn${level === l.id ? " is-on" : ""}`} aria-pressed={level === l.id} onClick={() => writeLevel(level === l.id ? null : l.id)}>{l.label}</button>
        ))}
      </div>
    </div>
  );
}
