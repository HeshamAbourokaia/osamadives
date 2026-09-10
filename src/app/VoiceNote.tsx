"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/voice/osama-hello.m4a";

/**
 * Osama's voice. A short voice note, the way people in Egypt actually say hello, played
 * with a tap under his introduction. The pill only appears once the recording is on the
 * site, so nothing here waits on a placeholder: drop the file in and it shows.
 */
export default function VoiceNote() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(SRC, { method: "HEAD" }).then((r) => { if (alive && r.ok && /audio/.test(r.headers.get("content-type") ?? "")) setReady(true); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  if (!ready) return null;
  const toggle = () => {
    if (!audio.current) {
      const a = new Audio(SRC);
      a.addEventListener("timeupdate", () => setP(a.duration ? a.currentTime / a.duration : 0));
      a.addEventListener("ended", () => { setPlaying(false); setP(0); });
      audio.current = a;
    }
    const a = audio.current;
    if (a.paused) { a.play().then(() => setPlaying(true)).catch(() => {}); } else { a.pause(); setPlaying(false); }
  };
  return (
    <button type="button" className={`voice${playing ? " is-playing" : ""}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? "Pause Osama's voice note" : "Hear Osama say hello"}>
      <span className="voice__ring" style={{ "--p": p } as React.CSSProperties} aria-hidden="true"><span className="voice__icon">{playing ? "❚❚" : "▶"}</span></span>
      <span className="voice__words"><strong>Hear Osama</strong><span>a voice note, in Arabic and English</span></span>
    </button>
  );
}
