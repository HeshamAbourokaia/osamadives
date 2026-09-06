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
  const [reached, setReached] = useState(0); // how many stops the drawn coast has passed
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const lengthRef = useRef(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    lengthRef.current = L;
    setPoints(STOPS.map((s) => { const p = path.getPointAtLength(L * s.at); return { x: p.x, y: p.y }; }));
  }, []);

  // The coast draws itself as the page is read: the bright stroke reaches each tick as
  // its act is reached. Page position is mapped to the line through the stops, so the
  // stroke and the ticks agree whatever the acts' heights are.
  useEffect(() => {
    const draw = () => {
      const L = lengthRef.current;
      const line = drawRef.current;
      if (!L || !line) return;
      const vh = window.innerHeight;
      const y = window.scrollY + vh * 0.45;
      // The first act starts at the very top of the page, y = 0, so a stop is kept when
      // its element exists, not when its y is positive: otherwise the Surface tick could
      // never light until the reader had already left it.
      const keys = STOPS.map((s) => {
        const el = document.getElementById(s.id);
        return el ? { at: s.at, y: el.getBoundingClientRect().top + window.scrollY } : null;
      }).filter((k): k is { at: number; y: number } => k !== null);
      let frac = 0;
      if (keys.length) {
        if (y <= keys[0].y) frac = keys[0].at * (y / Math.max(1, keys[0].y));
        else if (y >= keys[keys.length - 1].y) {
          const last = keys[keys.length - 1];
          const end = document.documentElement.scrollHeight - vh * 0.55;
          frac = last.at + (1 - last.at) * Math.min(1, (y - last.y) / Math.max(1, end - last.y));
        } else {
          for (let i = 0; i < keys.length - 1; i++) {
            if (y >= keys[i].y && y < keys[i + 1].y) {
              const t = (y - keys[i].y) / Math.max(1, keys[i + 1].y - keys[i].y);
              frac = keys[i].at + (keys[i + 1].at - keys[i].at) * t;
              break;
            }
          }
        }
      }
      line.style.strokeDasharray = `${L}`;
      line.style.strokeDashoffset = `${L * (1 - Math.min(1, Math.max(0, frac)))}`;
      let n = 0;
      for (const s of STOPS) if (frac >= s.at - 0.005) n++;
      setReached((prev) => (prev === n ? prev : n));
    };
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
    draw();
    const t = window.setTimeout(draw, 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); clearTimeout(t); };
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
        <path ref={pathRef} d={COAST} fill="none" stroke="rgba(63,209,190,0.3)" strokeWidth="1.4" strokeLinecap="round" />
        <path d={COAST} fill="none" stroke="rgba(63,209,190,0.12)" strokeWidth="6" strokeLinecap="round" />
        <path ref={drawRef} d={COAST} className="siderail__drawn" fill="none" stroke="#3fd1be" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {STOPS.map((s, i) => {
        const p = points[i];
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`siderail__stop${active === s.id ? " is-active" : ""}${i < reached ? " is-reached" : ""}${s.town ? " has-town" : ""}`}
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
