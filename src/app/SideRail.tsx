"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WHATSAPP } from "@/lib/contact";

// The acts, north to south along the shore. The line the ticks sit on is the west coast of
// the Gulf of Aqaba, Taba at the top down to Ras Mohammed at the tip: home, drawn small.
const STOPS = [
  { id: "brand-act", label: "Surface", at: 0.04 },
  { id: "guide-act", label: "Osama", at: 0.15 },
  { id: "peak-act", label: "1987", at: 0.26 },
  { id: "descent-act", label: "Classroom", at: 0.32 },
  { id: "coast-act", label: "Sites", at: 0.37 },
  { id: "orbit-act", label: "World", at: 0.5, town: "Dahab" },
  { id: "school-act", label: "School", at: 0.62 },
  { id: "gallery-act", label: "Gallery", at: 0.73 },
  { id: "stories", label: "Reviews", at: 0.84 },
  { id: "surface-act", label: "Contact", at: 0.95 },
];
// Taba, Nuweiba, Ras Shaitan, Dahab, Sharm el Sheikh, Ras Mohammed: the shore as a line.
const COAST = "M30 6 C24 30 22 52 27 78 C31 96 38 106 33 124 C28 142 20 160 22 186 C24 210 36 224 36 246 C36 270 24 290 24 314 C24 338 32 356 26 376 C22 390 16 402 12 414";

// On the inner pages the same shore carries the site itself: one stop per page.
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

type Point = { x: number; y: number };

/**
 * On a phone the rail lives off the edge of the screen and comes in when asked, the
 * way the Edge Panel does on the Samsung phones most people here carry: a slim handle
 * on the right, pulsing a little when a page arrives, and the whole coast slides in
 * over the page at a tap or a pull. The page keeps its full width. On a desk none of
 * this applies and the rail simply sits where it always has.
 *
 * Two things a fixed element cannot do on its own are handled here as well. It cannot
 * stay where the reader can see it: "fixed" is anchored to the layout viewport, so a
 * pinch and a pan slide it off the glass. visualViewport reports the window the reader
 * really sees, so the rail is placed against that while zoomed and scaled back down.
 * And the coast is drawn at a fixed 48 wide because the dots come from getPointAtLength
 * in the path's own units; on a phone it is squeezed by the same factor as the dots,
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
      // At the page's natural size there is nothing to correct, and the transform has to
      // come off rather than be set to none: any transform makes this element the
      // containing block for anything fixed inside it.
      if (s < 1.01 && Math.abs(vv.offsetLeft) < 0.5 && Math.abs(vv.offsetTop) < 0.5) {
        node.style.removeProperty("transform");
        return;
      }
      const rightPx = parseFloat(getComputedStyle(node).right) || 0;
      const dx = vv.offsetLeft + vv.width - rightPx / s - (window.innerWidth - rightPx);
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
      if (el) el.style.removeProperty("transform");
    };
  }, [railRef]);
  return { sx: narrow ? NARROW : 1, narrow };
}

/**
 * Slide along the coast to choose. Press the line, keep the finger down and run it up
 * or down: whichever stop is under the thumb becomes the one and says its name. Lift
 * to go there. Land back on the stop you started from and nothing happens. A plain tap
 * is left alone, so the link underneath still does its own job. A clear pull to the
 * right is not a choice at all: it puts the rail away.
 */
function useScrub(points: Point[], onPick: (i: number) => void, onDismiss?: () => void) {
  const [scrub, setScrub] = useState<number | null>(null);
  const rail = useRef<HTMLElement>(null);
  const from = useRef<{ i: number; x: number; y: number; moved: boolean; gone: boolean } | null>(null);
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
      // Short screens scroll the menu itself instead of scrubbing the coastline.
      if (e.currentTarget.scrollHeight > e.currentTarget.clientHeight + 1) {
        from.current = null;
        return;
      }
      const t = e.touches[0];
      const i = nearest(t.clientY);
      from.current = { i, x: t.clientX, y: t.clientY, moved: false, gone: false };
      at.current = i;
      setScrub(i);
    },
    onTouchMove: (e: React.TouchEvent) => {
      const f = from.current;
      if (!f || f.gone) return;
      const t = e.touches[0];
      const dx = t.clientX - f.x, dy = t.clientY - f.y;
      if (dx > 44 && dx > Math.abs(dy)) {
        f.gone = true;
        at.current = null;
        setScrub(null);
        onDismiss?.();
        return;
      }
      if (Math.abs(dy) > 8) f.moved = true;
      const i = nearest(t.clientY);
      at.current = i;
      setScrub(i);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const f = from.current, i = at.current;
      from.current = null; at.current = null;
      setScrub(null);
      if (!f) return;
      if (f.gone) { e.preventDefault(); return; }
      if (i === null || !f.moved) return;    // a tap: let the anchor follow itself
      e.preventDefault();                     // a slide: no ghost click on the anchor
      if (i === f.i) return;                  // slid away and came home: stay put
      onPick(i);
    },
    onTouchCancel: () => { from.current = null; at.current = null; setScrub(null); },
  };

  return { rail, scrub, handlers };
}

/**
 * The handle on the edge: tap it, or pull it in, and the coast follows. It carries the
 * name of where you are, written up its length the way a tab on the side of a page
 * does, so it answers both questions before it is touched: this is a control, and you
 * are on Gallery.
 */
function Handle({ open, name, onToggle, onOpen }: { open: boolean; name: string; onToggle: () => void; onOpen: () => void }) {
  const drag = useRef<{ x: number; opened: boolean } | null>(null);
  return (
    <button
      type="button"
      className="siderail__handle"
      aria-label={open ? "Close the menu" : `Menu. You are on ${name}`}
      aria-expanded={open}
      aria-controls="od-coast-menu"
      onClick={onToggle}
      onTouchStart={(e) => { drag.current = { x: e.touches[0].clientX, opened: false }; }}
      onTouchMove={(e) => {
        const d = drag.current;
        if (!d || d.opened || open) return;
        if (d.x - e.touches[0].clientX > 22) { d.opened = true; onOpen(); }
      }}
      onTouchEnd={(e) => {
        if (drag.current?.opened) e.preventDefault(); // the pull opened it; no tap to close it again
        drag.current = null;
      }}
    >
      <span className="siderail__handle-name mono" aria-hidden="true">{name}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6" /></svg>
    </button>
  );
}

/**
 * While the coast is in over the page, the page waits behind a scrim and does not
 * scroll. The menu button at the top left asks for the coast through one event, so
 * the two doors open the same room.
 */
function useSheet(open: boolean, narrow: boolean, close: () => void, toggle: () => void, rail: React.RefObject<HTMLElement>) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("od:rail-state", { detail: open && narrow }));
    if (!narrow) close();
  }, [open, narrow, close]);
  useEffect(() => {
    if (!narrow) return;
    window.addEventListener("od:rail", toggle);
    return () => window.removeEventListener("od:rail", toggle);
  }, [narrow, toggle]);
  useEffect(() => {
    if (!open || !narrow) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const panel = rail.current?.querySelector<HTMLElement>(".siderail__panel");
    if (panel) panel.scrollTop = 0;
    rail.current?.querySelector<HTMLElement>(".siderail__panel a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      if (e.key !== "Tab") return;
      const button = document.querySelector<HTMLElement>(".navbtn");
      const items = Array.from(rail.current?.querySelectorAll<HTMLElement>("button, a") ?? []);
      const focusable = [button, ...items].filter((el): el is HTMLElement => !!el && el.getClientRects().length > 0);
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      const next = index < 0 ? 0 : (index + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      e.preventDefault();
      focusable[next]?.focus();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open, narrow, close, rail]);
}

function Coast({ sx, pathRef, drawRef }: { sx: number; pathRef: React.RefObject<SVGPathElement>; drawRef: React.RefObject<SVGPathElement> }) {
  return (
    <svg
      className="siderail__coast"
      viewBox="0 0 48 420" width="48" height="420" aria-hidden="true" focusable="false"
      style={{ left: "var(--rail-x, 0px)", transform: `scaleX(${sx})`, transformOrigin: "left center" }}
    >
      <path ref={pathRef} d={COAST} fill="none" stroke="rgba(63,209,190,0.3)" strokeWidth="1.4" strokeLinecap="round" />
      <path d={COAST} fill="none" stroke="rgba(63,209,190,0.12)" strokeWidth="6" strokeLinecap="round" />
      <path ref={drawRef} d={COAST} className="siderail__drawn" fill="none" stroke="#3fd1be" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const stopStyle = (p: Point | undefined, sx: number) =>
  p ? { left: `calc(var(--rail-x, 0px) + ${p.x * sx}px)`, top: `${p.y}px` } : undefined;

export default function SideRail({ mode = "home" }: { mode?: "home" | "site" }) {
  if (mode === "site") return <SiteRail stops={SITE_STOPS} />;
  return <HomeRail />;
}

function SiteRail({ stops }: { stops: typeof SITE_STOPS }) {
  const pathname = usePathname() || "/";
  const [points, setPoints] = useState<Point[]>([]);
  const [open, setOpen] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const activeIndex = Math.max(0, stops.findIndex((s) => s.href !== "/" && !s.href.startsWith("http") && pathname.startsWith(s.href)));
  const { rail, scrub, handlers } = useScrub(points, (i) => {
    const href = stops[i].href;
    setOpen(false);
    if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  }, () => setOpen(false));
  const { sx, narrow } = useEdge(rail);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  useSheet(open, narrow, close, toggle, rail);
  useEffect(() => {
    const path = pathRef.current, line = drawRef.current;
    if (!path || !line) return;
    const L = path.getTotalLength();
    setPoints(stops.map((s) => { const p = path.getPointAtLength(L * s.at); return { x: p.x, y: p.y }; }));
    line.style.strokeDasharray = `${L}`;
    line.style.strokeDashoffset = `${L * (1 - stops[activeIndex].at)}`;
  }, [activeIndex, stops]);
  return (
    <>
      {open && narrow ? <div className="siderail__scrim" onClick={() => setOpen(false)} aria-hidden="true" /> : null}
      <nav
        ref={rail as React.RefObject<HTMLElement>}
        className={`siderail${open ? " is-open" : ""}${scrub !== null ? " is-scrubbing" : ""}`}
        aria-label="Pages of the site, laid along the Sinai shore"
      >
        <Handle open={open} name={stops[activeIndex].label} onToggle={() => setOpen((o) => !o)} onOpen={() => setOpen(true)} />
        <div id="od-coast-menu" className="siderail__panel" aria-hidden={narrow && !open} {...handlers}>
          <Coast sx={sx} pathRef={pathRef} drawRef={drawRef} />
          {stops.map((s, i) => {
            const external = s.href.startsWith("http");
            return (
              <a
                key={s.href}
                href={s.href}
                tabIndex={narrow && !open ? -1 : undefined}
                onClick={close}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={`siderail__stop${i === activeIndex ? " is-active" : ""}${i < activeIndex ? " is-reached" : ""}${s.town ? " has-town" : ""}${i === scrub ? " is-scrub" : ""}`}
                style={stopStyle(points[i], sx)}
                aria-current={i === activeIndex ? "page" : undefined}
              >
                <span className="siderail__dot" aria-hidden="true" />
                <span className="siderail__label mono">{s.label}</span>
                {s.town ? <span className="siderail__town mono" aria-hidden="true">{s.town}</span> : null}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function HomeRail() {
  const [active, setActive] = useState("brand-act");
  const [reached, setReached] = useState(0); // how many stops the drawn coast has passed
  const [points, setPoints] = useState<Point[]>([]);
  const [open, setOpen] = useState(false);
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
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); jump(id); };
  const { rail, scrub, handlers } = useScrub(points, (i) => { setOpen(false); jump(STOPS[i].id); }, () => setOpen(false));
  const { sx, narrow } = useEdge(rail);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  useSheet(open, narrow, close, toggle, rail);

  return (
    <>
      {open && narrow ? <div className="siderail__scrim" onClick={() => setOpen(false)} aria-hidden="true" /> : null}
      <nav
        ref={rail as React.RefObject<HTMLElement>}
        className={`siderail${open ? " is-open" : ""}${scrub !== null ? " is-scrubbing" : ""}`}
        aria-label="Sections of the dive, laid along the Sinai shore from Taba to Ras Mohammed"
      >
        <Handle open={open} name={STOPS.find((s) => s.id === active)?.label ?? STOPS[0].label} onToggle={() => setOpen((o) => !o)} onOpen={() => setOpen(true)} />
        <div id="od-coast-menu" className="siderail__panel" aria-hidden={narrow && !open} {...handlers}>
          <Coast sx={sx} pathRef={pathRef} drawRef={drawRef} />
          {STOPS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              tabIndex={narrow && !open ? -1 : undefined}
              className={`siderail__stop${active === s.id ? " is-active" : ""}${i < reached ? " is-reached" : ""}${s.town ? " has-town" : ""}${i === scrub ? " is-scrub" : ""}`}
              style={stopStyle(points[i], sx)}
              onClick={go(s.id)}
              aria-current={active === s.id ? "true" : undefined}
            >
              <span className="siderail__dot" aria-hidden="true" />
              <span className="siderail__label mono">{s.label}</span>
              {s.town ? <span className="siderail__town mono" aria-hidden="true">{s.town}</span> : null}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
