"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Element) => unknown; instances: unknown[] };
  }
}

const ENGINE_SRC = "/descent/scrollcraft.js";

// The dive computer. Page progress maps to a dive profile; the close surfaces at exactly zero.
function startHud() {
  const depthEl = document.getElementById("hud-depth");
  const labelEl = document.getElementById("hud-label");
  const trackEl = document.getElementById("hud-track");
  if (!depthEl || !labelEl || !trackEl) return () => {};
  // [pageProgress, depth, label] keyframes, lerped between
  const K: [number, number, string][] = [
    [0.0, 0.0, "Entry"],
    [0.13, 12.0, "Stop 1 · The guide"],
    [0.3, 12.0, "Stop 1 · The guide"],
    [0.38, 18.0, "1987"],
    [0.55, 18.0, "1987"],
    [0.66, 30.0, "Stop 2 · The sites"],
    [0.78, 30.0, "Stop 3 · The school"],
    [0.9, 30.0, "Ascent"],
    [1.0, 0.0, "Surface"],
  ];
  const max = 30;
  let raf: number | null = null;
  // The narrative ends at the surfacing act; the tail below it stays "on the surface".
  const main = document.getElementById("descent-main");
  function update() {
    raf = null;
    const end = main ? main.offsetTop + main.offsetHeight - innerHeight : document.documentElement.scrollHeight - innerHeight;
    const p = Math.min(1, Math.max(0, scrollY / Math.max(1, end)));
    let d = 0;
    let label = K[0][2];
    for (let i = 0; i < K.length - 1; i++) {
      if (p >= K[i][0] && p <= K[i + 1][0]) {
        const t = (p - K[i][0]) / Math.max(1e-6, K[i + 1][0] - K[i][0]);
        d = K[i][1] + (K[i + 1][1] - K[i][1]) * t;
        label = t < 0.5 ? K[i][2] : K[i + 1][2];
        break;
      }
    }
    if (p >= 1) { d = 0; label = "Surface"; }
    depthEl!.textContent = (d < 10 ? "0" : "") + d.toFixed(1);
    labelEl!.textContent = label;
    trackEl!.style.transform = "scaleX(" + (d / max).toFixed(3) + ")";
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener("scroll", onScroll, { passive: true });
  update();
  return () => removeEventListener("scroll", onScroll);
}

export default function DescentBoot() {
  useEffect(() => {
    let cancelled = false;
    let stopHud: (() => void) | null = null;
    const boot = () => {
      if (cancelled || !window.ScrollCraft) return;
      window.ScrollCraft.mount(document.body);
      stopHud = startHud();
    };
    if (window.ScrollCraft) {
      boot();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${ENGINE_SRC}"]`);
      const script = existing ?? document.createElement("script");
      script.addEventListener("load", boot, { once: true });
      if (!existing) {
        script.src = ENGINE_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
    }
    return () => {
      cancelled = true;
      if (stopHud) stopHud();
    };
  }, []);
  return null;
}
