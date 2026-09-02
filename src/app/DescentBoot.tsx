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
  // Keyframes are built from where the acts actually sit on the page, so the gauge reads
  // the real depth of what is on screen: sand at 0, three photographs at 12 / 22 / 30 m,
  // the sites at 30, a safety stop at 5 for the school, then the surface.
  const main = document.getElementById("descent-main");
  const top = (id: string) => { const el = document.getElementById(id); return el ? el.offsetTop : 0; };
  const height = (id: string) => { const el = document.getElementById(id); return el ? el.offsetHeight : 0; };
  const end = main ? main.offsetTop + main.offsetHeight - innerHeight : document.documentElement.scrollHeight - innerHeight;
  const f = (y: number) => Math.min(1, Math.max(0, y / Math.max(1, end)));
  const d0 = top("descent-act"), dh = height("descent-act") - innerHeight;
  const K: [number, number, string][] = [
    [0, 0, "Entry"],
    [f(top("guide-act")), 0, "On the sand · The guide"],
    [f(top("peak-act")), 0, "1987 · The shore"],
    [f(d0), 0, "Descending"],
    [f(d0 + dh * 0.15), 12, "12 m · Lighthouse Reef"],
    [f(d0 + dh * 0.34), 12, "12 m · Lighthouse Reef"],
    [f(d0 + dh * 0.5), 22, "22 m · The Canyon"],
    [f(d0 + dh * 0.68), 22, "22 m · The Canyon"],
    [f(d0 + dh * 0.85), 30, "30 m · Blue Hole"],
    [f(top("coast-act")), 30, "30 m · The sites"],
    [f(top("school-act")), 5, "Safety stop · The school"],
    [f(top("surface-act")), 5, "Ascent"],
    [f(top("surface-act") + height("surface-act") * 0.6), 0, "Surface"],
    [1, 0, "Surface"],
  ];
  const max = 30;
  let raf: number | null = null;
  function update() {
    raf = null;
    const p = f(scrollY);
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
