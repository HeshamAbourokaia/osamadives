"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Osama hovering: his own footage, shown plainly.
 *
 * Nothing is laid over this one. No caustics, no light band, no bubbles, no scrim. The
 * point of the section is that you can see exactly what he is doing, so the picture is
 * left alone and the words sit underneath it.
 *
 * Nothing downloads until the clip is on a screen. It plays only while it is in view and
 * pauses the moment it leaves, so a phone never pays for a video nobody scrolled to.
 * Anyone who asked for less motion gets the still frame and a play button instead.
 */
export default function HoverClip() {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].intersectionRatio > 0.3) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.3] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="hoverclip__v"
      poster="/clips/osama-hover-poster.webp"
      muted
      loop
      playsInline
      preload="none"
      controls={still}
      aria-label="Osama hovering over the sand, motionless, hands off the bottom, his bubbles going straight up"
    >
      <source src="/clips/osama-hover.mp4" type="video/mp4" />
    </video>
  );
}
