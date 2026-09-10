"use client";

import { useRef, useState } from "react";

const SRC = "/voice/osama-hello.m4a";

/**
 * Osama's voice. A short voice note, the way people in Egypt actually say hello, played
 * with a tap under his introduction. The server only renders this once the recording is
 * on the site, so no phone ever asks for a file that is not there.
 */
export default function VoicePlayer() {
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
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
