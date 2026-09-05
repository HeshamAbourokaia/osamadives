"use client";

import { useEffect, useRef, useState } from "react";

// The acts, north to south along the shore. The line the ticks sit on is the west coast of
// the Gulf of Aqaba, Taba at the top down to Ras Mohammed at the tip: home, drawn small.
const STOPS = [
  { id: "brand-act", label: "Surface", at: 0.04 },
  { id: "guide-act", label: "Osama", at: 0.15 },
  { id: "peak-act", label: "1987", at: 0.26 },
  { id: "coast-act", label: "The sites", at: 0.37 },
  { id: "orbit-act", label: "His world", at: 0.5, town: "Dahab" },
  { id: "school-act", label: "The school", at: 0.62 },
  { id: "gallery-act", label: "Gallery", at: 0.73 },
  { id: "stories", label: "Reviews", at: 0.84 },
  { id: "surface-act", label: "Contact", at: 0.95 },
];
// Taba, Nuweiba, Ras Shaitan, Dahab, Sharm el Sheikh, Ras Mohammed: the shore as a line.
const COAST = "M30 6 C24 30 22 52 27 78 C31 96 38 106 33 124 C28 142 20 160 22 186 C24 210 36 224 36 246 C36 270 24 290 24 314 C24 338 32 356 26 376 C22 390 16 402 12 414";

export default function SideRail() {
  const [active, setActive] = useState("brand-act");
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    setPoints(STOPS.map((s) => { const p = path.getPointAtLength(L * s.at); return { x: p.x, y: p.y }; }));
  }, []);

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const pick = () => {
      const mid = window.innerHeight * 0.45;
      let best = els[0], bestD = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
        if (d < bestD) { bestD = d; best = el; }
      }
      setActive(best.id);
    };
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = el.getBoundingClientRect();
    // A pinned act's first screen is its opening frame with the words still to come; land a
    // third of the way in, where the copy is up. A flowing act lands at its top.
    const pinned = ["pin", "scrub", "pan"].includes(el.getAttribute("data-sc-act") || "");
    const into = pinned ? Math.max(0, r.height - window.innerHeight) * 0.35 : 0;
    const top = r.top + window.scrollY + into + 2;
    window.scrollTo({ top: Math.min(top, document.documentElement.scrollHeight - window.innerHeight), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <nav className="siderail" aria-label="Sections of the dive, laid along the Sinai shore from Taba to Ras Mohammed">
      <svg className="siderail__coast" viewBox="0 0 48 420" width="48" height="420" aria-hidden="true" focusable="false">
        <path ref={pathRef} d={COAST} fill="none" stroke="rgba(63,209,190,0.55)" strokeWidth="1.4" strokeLinecap="round" />
        <path d={COAST} fill="none" stroke="rgba(63,209,190,0.18)" strokeWidth="6" strokeLinecap="round" />
      </svg>
      {STOPS.map((s, i) => {
        const p = points[i];
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`siderail__stop${active === s.id ? " is-active" : ""}${s.town ? " has-town" : ""}`}
            style={p ? { left: `${p.x}px`, top: `${p.y}px` } : undefined}
            onClick={go(s.id)}
            aria-current={active === s.id ? "true" : undefined}
          >
            <span className="siderail__dot" aria-hidden="true" />
            <span className="siderail__label mono">{s.label}</span>
            {s.town ? <span className="siderail__town mono" aria-hidden="true">{s.town}</span> : null}
          </a>
        );
      })}
    </nav>
  );
}
