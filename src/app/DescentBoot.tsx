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
  let fOf = (y: number) => y;
  // Keyframes are built from where the acts actually sit on the page, so the gauge reads
  // the real depth of what is on screen: sand at 0, three photographs at 12 / 22 / 30 m,
  // the sites at 30, a safety stop at 5 for the school, then the surface.
  const main = document.getElementById("descent-main");
  const build = (): [number, number, string][] => {
  const top = (id: string) => { const el = document.getElementById(id); return el ? el.offsetTop : 0; };
  const height = (id: string) => { const el = document.getElementById(id); return el ? el.offsetHeight : 0; };
  const end = main ? main.offsetTop + main.offsetHeight - innerHeight : document.documentElement.scrollHeight - innerHeight;
  const f = (y: number) => Math.min(1, Math.max(0, y / Math.max(1, end)));
  fOf = f;
  const d0 = top("descent-act"), dh = height("descent-act") - innerHeight;
  return [
    [0, 0, "Entry"],
    [f(top("guide-act")), 0, "On the sand · The guide"],
    [f(top("peak-act")), 0, "1987 · The shore"],
    [f(d0), 0, "Descending"],
    [f(d0 + dh * 0.15), 7, "7 m · Om El Seed"],
    [f(d0 + dh * 0.34), 7, "7 m · Om El Seed"],
    [f(d0 + dh * 0.5), 8, "8 m · Blue Hole edge"],
    [f(d0 + dh * 0.68), 8, "8 m · Blue Hole edge"],
    [f(d0 + dh * 0.85), 12, "12 m · The blue"],
    [f(top("coast-act")), 12, "12 m · The sites"],
    [f(top("coast-act") + height("coast-act") - innerHeight), 12, "12 m · The sites"],
    [f(top("orbit-act")), 9, "9 m · His world"],
    [f(top("orbit-act") + height("orbit-act") - innerHeight), 9, "9 m · His world"],
    [f(top("school-act")), 5, "Safety stop · The school"],
    [f(top("surface-act")), 5, "Ascent"],
    [f(top("surface-act") + height("surface-act") * 0.6), 0, "Surface"],
    [1, 0, "Surface"],
  ];
  };
  const max = 30;
  let raf: number | null = null;
  // While the sites rail is on screen, the card in focus sets the reading (RailFocus
  // says which). The keyframes hold 12 m for that stretch; the site's own depth replaces it.
  let site: { depth: number; label: string } | null = null;
  const onSite = (e: Event) => { site = (e as CustomEvent).detail ?? null; onScroll(); };
  addEventListener("od:site", onSite);
  function update() {
    raf = null;
    const K = build();
    const p = fOf(scrollY);
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
    if (site && label.endsWith("The sites")) { d = site.depth; label = site.label; }
    depthEl!.textContent = (d < 10 ? "0" : "") + d.toFixed(1);
    if (labelEl!.textContent !== label) {
      // A new marker on the profile: the gauge pings once, a ring going out from the pill.
      labelEl!.textContent = label;
      const hud = labelEl!.closest(".hud");
      if (hud) { hud.classList.remove("is-ping"); void (hud as HTMLElement).offsetWidth; hud.classList.add("is-ping"); }
    }
    trackEl!.style.transform = "scaleX(" + Math.min(1, d / max).toFixed(3) + ")";
    // The gauge reads zero for the whole first third of the page and again at the end,
    // where it says nothing. It shows itself once there is a depth to show and stands
    // down when the diver is back on the surface.
    const hudEl = depthEl!.closest(".hud");
    if (hudEl) hudEl.classList.toggle("is-under", d > 0.05);
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener("scroll", onScroll, { passive: true });
  update();
  return () => { removeEventListener("scroll", onScroll); removeEventListener("od:site", onSite); };
}

export default function DescentBoot() {
  useEffect(() => {
    let cancelled = false;
    let stopHud: (() => void) | null = null;
    const boot = () => {
      if (cancelled || !window.ScrollCraft) return;
      // On a phone a rail that pans on the vertical wheel is a puzzle: you cannot go
      // back to a card, and the page stops moving while the cards do. There the three
      // rails become ordinary acts and the cards are swiped sideways, natively.
      if (matchMedia("(max-width: 860px)").matches) {
        document.querySelectorAll<HTMLElement>("section:has(.js-rail)").forEach((sec) => {
          sec.setAttribute("data-sc-act", "flow");
          sec.removeAttribute("data-sc-span");
          sec.style.removeProperty("--sc-span");
          sec.classList.add("rail-swipe");
        });
      }
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
