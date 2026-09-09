"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WHATSAPP } from "@/lib/contact";

// The acts, north to south along the shore. The line the ticks sit on is the west coast of
// the Gulf of Aqaba, Taba at the top down to Ras Mohammed at the tip: home, drawn small.
const STOPS = [
  { id: "brand-act", label: "Surface", at: 0.04 },
  { id: "guide-act", label: "Osama", at: 0.15 },
  { id: "peak-act", label: "1987", at: 0.26 },
  { id: "coast-act", label: "Sites", at: 0.37 },
  { id: "orbit-act", label: "World", at: 0.5, town: "Dahab" },
  { id: "school-act", label: "School", at: 0.62 },
  { id: "gallery-act", label: "Gallery", at: 0.73 },
  { id: "stories", label: "Reviews", at: 0.84 },
  { id: "surface-act", label: "Contact", at: 0.95 },
];
// Taba, Nuweiba, Ras Shaitan, Dahab, Sharm el Sheikh, Ras Mohammed: the shore as a line.
const COAST = "M30 6 C24 30 22 52 27 78 C31 96 38 106 33 124 C28 142 20 160 22 186 C24 210 36 224 36 246 C36 270 24 290 24 314 C24 338 32 356 26 376 C22 390 16 402 12 414";

// On the inner pages the same shore carries the site itself: one stop per page. The
// rail on the edge and the one in the drawer read from this single list, so a page
// added here appears in both without anything else being touched.
const SITE_STOPS = [
  { href: "/", label: "Home", at: 0.04 },
  { href: "/diving-with-osama", label: "Teaching", at: 0.17 },
  { href: "/dive-sites", label: "Sites", at: 0.3 },
  { href: "/blog", label: "Journal", at: 0.43 },
  { href: "/gallery", label: "Gallery", at: 0.56, town: "Dahab" },
  { href: "/review", label: "Reviews", at: 0.69 },
  { href: "/featured/chatgpt", label: "Featured", at: 0.82 },
  { href: WHATSAPP, label: "Contact", at: 0.95 },
];

/**
 * Slide along the coast to choose. Press anywhere on the line, keep the finger down
 * and run it up or down: whichever stop is under your thumb becomes the one, and says
 * its name. Lift to go there. Land back on the stop you started from and nothing
 * happens, because that is where you already are. A plain tap is left alone, so the
 * link underneath still does its own job.
 */
/**
 * Two things a fixed element cannot do on its own.
 *
 * It cannot stay where the reader can see it: "fixed" is anchored to the layout
 * viewport, so the moment somebody pinches to zoom and pans, the rail slides off the
 * side of what is actually on screen and is very hard to find again. visualViewport
 * reports the window the reader is really looking at, so the rail is placed against
 * that instead, and scaled back down so it keeps its size on the glass.
 *
 * And the coast is drawn at a fixed 48 wide because the dots are placed from
 * getPointAtLength in the path's own units. On a phone that band is too wide to sit
 * beside the words, so it is squeezed horizontally by the same factor the dots are,
 * which keeps every dot on the line.
 */
const NARROW = 0.55;

function useEdge(railRef: React.RefObject<HTMLElement>) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const onMq = () => setNarrow(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    const vv = window.visualViewport;
    const el = railRef.current;
    let raf = 0;
    const place = () => {
      raf = 0;
      const node = railRef.current;
      if (!node || !vv || !mq.matches) return;
      const s = vv.scale || 1;
      // Nothing to correct while the page sits at its natural size, and the transform has
      // to come off rather than be set to none: any transform makes this element the
      // containing block for the fixed strip behind it, which would then be the height of
      // the rail instead of the height of the screen.
      if (s < 1.01 && Math.abs(vv.offsetLeft) < 0.5 && Math.abs(vv.offsetTop) < 0.5) {
        node.style.removeProperty("transform");
        return;
      }
      // The rail rests against the right edge, vertically centred, with its origin on that
      // right edge, so a scale here moves neither. All this says is how far the window the
      // reader can actually see has drifted from the one the page thinks it has.
      const dx = vv.offsetLeft + vv.width - 2 / s - (window.innerWidth - 2);
      const dy = vv.offsetTop + vv.height / 2 - window.innerHeight / 2;
      node.style.transform = `translate(${dx}px, ${dy}px) scale(${1 / s})`;
    };
    const onMove = () => { if (!raf) raf = requestAnimationFrame(place); };
    if (vv) {
      place();
      vv.addEventListener("resize", onMove);
      vv.addEventListener("scroll", onMove);
    }
    window.addEventListener("resize", onMove);
    return () => {
      mq.removeEventListener("change", onMq);
      if (vv) { vv.removeEventListener("resize", onMove); vv.removeEventListener("scroll", onMove); }
      window.removeEventListener("resize", onMove);
      if (raf) cancelAnimationFrame(raf);
      if (el) el.style.transform = "";
    };
  }, [railRef]);
  return narrow ? NARROW : 1;
}

function useScrub(points: { x: number; y: number }[], onPick: (i: number) => void) {
  const [scrub, setScrub] = useState<number | null>(null);
  const rail = useRef<HTMLElement>(null);
  const from = useRef<{ i: number; y: number; moved: boolean } | null>(null);
  const at = useRef<number | null>(null);

  const nearest = (clientY: number) => {
    const box = rail.current?.getBoundingClientRect();
    if (!box || !points.length) return 0;
    const y = clientY - box.top;
    let best = 0, bestD = Infinity;
    points.forEach((p, i) => { const d = Math.abs(p.y - y); if (d < bestD) { bestD = d; best = i; } });
    return best;
  };

  const handlers = {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      const i = nearest(t.clientY);
      from.current = { i, y: t.clientY, moved: false };
      at.current = i;
      setScrub(i);
    },
    onTouchMove: (e: React.TouchEvent) => {
      const f = from.current;
      if (!f) return;
      const t = e.touches[0];
      if (Math.abs(t.clientY - f.y) > 8) f.moved = true;
      const i = nearest(t.clientY);
      at.current = i;
      setScrub(i);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const f = from.current, i = at.current;
      from.current = null; at.current = null;
      setScrub(null);
      if (!f || i === null || !f.moved) return; // a tap: let the anchor follow itself
      e.preventDefault();                        // a slide: no ghost click on the anchor
      if (i === f.i) return;                     // slid away and came home: stay put
      onPick(i);
    },
    onTouchCancel: () => { from.current = null; at.current = null; setScrub(null); },
  };

  return { rail, scrub, handlers };
}

export default function SideRail({ mode = "home" }: { mode?: "home" | "site" }) {
  if (mode === "site") return <SiteRail stops={SITE_STOPS} />;
  return <HomeRail />;
}

function SiteRail({ stops }: { stops: typeof SITE_STOPS }) {
  const pathname = usePathname() || "/";
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const activeIndex = Math.max(0, stops.findIndex((s) => s.href !== "/" && !s.href.startsWith("http") && pathname.startsWith(s.href)));
  const { rail, scrub, handlers } = useScrub(points, (i) => {
    const href = stops[i].href;
    if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  });
  const sx = useEdge(rail);
  useEffect(() => {
    const path = pathRef.current, line = drawRef.current;
    if (!path || !line) return;
    const L = path.getTotalLength();
    setPoints(stops.map((s) => { const p = path.getPointAtLength(L * s.at); return { x: p.x, y: p.y }; }));
    line.style.strokeDasharray = `${L}`;
    line.style.strokeDashoffset = `${L * (1 - stops[activeIndex].at)}`;
  }, [activeIndex, stops]);
  return (
    <nav
      ref={rail as React.RefObject<HTMLElement>}
      className={`siderail${scrub !== null ? " is-scrubbing" : ""}`}
      aria-label="Pages of the site, laid along the Sinai shore"
      {...handlers}
    >
      <svg className="siderail__coast" viewBox="0 0 48 420" width="48" height="420" aria-hidden="true" focusable="false" style={{ transform: `scaleX(${sx})`, transformOrigin: "left center" }}>
        <path ref={pathRef} d={COAST} fill="none" stroke="rgba(63,209,190,0.3)" strokeWidth="1.4" strokeLinecap="round" />
        <path d={COAST} fill="none" stroke="rgba(63,209,190,0.12)" strokeWidth="6" strokeLinecap="round" />
        <path ref={drawRef} d={COAST} className="siderail__drawn" fill="none" stroke="#3fd1be" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {stops.map((s, i) => {
        const p = points[i];
        const external = s.href.startsWith("http");
        return (
          <a
            key={s.href}
            href={s.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`siderail__stop${i === activeIndex ? " is-active" : ""}${i < activeIndex ? " is-reached" : ""}${s.town ? " has-town" : ""}${i === scrub ? " is-scrub" : ""}`}
            style={p ? { left: `${p.x * sx}px`, top: `${p.y}px` } : undefined}
            aria-current={i === activeIndex ? "page" : undefined}
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

function HomeRail() {
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

  const jump = (id: string) => {
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
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); jump(id); };
  const { rail, scrub, handlers } = useScrub(points, (i) => jump(STOPS[i].id));
  const sx = useEdge(rail);

  return (
    <nav
      ref={rail as React.RefObject<HTMLElement>}
      className={`siderail${scrub !== null ? " is-scrubbing" : ""}`}
      aria-label="Sections of the dive, laid along the Sinai shore from Taba to Ras Mohammed"
      {...handlers}
    >
      <svg className="siderail__coast" viewBox="0 0 48 420" width="48" height="420" aria-hidden="true" focusable="false" style={{ transform: `scaleX(${sx})`, transformOrigin: "left center" }}>
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
            className={`siderail__stop${active === s.id ? " is-active" : ""}${i < reached ? " is-reached" : ""}${s.town ? " has-town" : ""}${i === scrub ? " is-scrub" : ""}`}
            style={p ? { left: `${p.x * sx}px`, top: `${p.y}px` } : undefined}
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
