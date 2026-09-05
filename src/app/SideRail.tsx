"use client";

import { useEffect, useState } from "react";

const STOPS = [
  { id: "brand-act", label: "Surface" },
  { id: "guide-act", label: "Osama" },
  { id: "peak-act", label: "1987" },
  { id: "coast-act", label: "The sites" },
  { id: "orbit-act", label: "His world" },
  { id: "school-act", label: "The school" },
  { id: "gallery-act", label: "Gallery" },
  { id: "stories", label: "Reviews" },
  { id: "surface-act", label: "Contact" },
];

// A dive line down the right edge: one tick per act, the current one lit, a label only when
// the pointer comes near. It never takes the eye from the page; it is there when wanted.
export default function SideRail() {
  const [active, setActive] = useState("brand-act");
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
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 2, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <nav className="siderail" aria-label="Sections of the dive">
      <span className="siderail__line" aria-hidden="true" />
      {STOPS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={`siderail__stop${active === s.id ? " is-active" : ""}`} onClick={go(s.id)} aria-current={active === s.id ? "true" : undefined}>
          <span className="siderail__dot" aria-hidden="true" />
          <span className="siderail__label mono">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
