"use client";

import { useEffect, useRef, useState } from "react";

/** Real footage, with an explicit control that also works when autoplay is blocked. */
export default function HoverClip() {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pauseOffscreen = () => { inView.current = false; video.pause(); };
    const motionChanged = () => {
      if (motion.matches) { userPaused.current = true; video.pause(); }
    };
    const hidden = () => { if (document.hidden) pauseOffscreen(); };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      inView.current = entry.intersectionRatio > 0.3;
      if (!inView.current) video.pause();
      else if (!motion.matches && !userPaused.current && !document.hidden) {
        void video.play().catch(() => { /* The visible play control remains available. */ });
      }
    }, { threshold: [0, 0.3] });
    observer?.observe(video);
    motion.addEventListener("change", motionChanged);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", motionChanged);
      document.removeEventListener("visibilitychange", hidden);
      pauseOffscreen();
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (!video.paused) { userPaused.current = true; video.pause(); }
    else {
      userPaused.current = false;
      void video.play().catch(() => setError(true));
    }
  };

  return (
    <>
      <video ref={ref} id="osama-hover-video" className="hoverclip__v"
        poster="/clips/osama-hover-poster.webp" muted loop playsInline preload="none" controls
        onPlay={() => { setPlaying(true); setError(false); }}
        onPause={() => { setPlaying(false); if (inView.current) userPaused.current = true; }}
        onError={() => setError(true)}
        aria-label="Silent video of Osama hovering over the sand without touching the bottom">
        <source src="/clips/osama-hover.mp4" type="video/mp4" />
      </video>
      <div className="hoverclip__controls">
        <button type="button" onClick={toggle} aria-controls="osama-hover-video">{playing ? "Pause video" : "Play video"}</button>
        <span>Osama’s own footage · no sound</span>
      </div>
      {error ? <p role="status">The video could not play. <a href="/clips/osama-hover.mp4">Open the video directly</a>.</p> : null}
    </>
  );
}
