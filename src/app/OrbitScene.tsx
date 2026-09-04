"use client";

import { useEffect, useRef, useState } from "react";
import type { OrbitItem } from "@/lib/orbit-content";

interface OrbitSceneProps {
  items: OrbitItem[];
  osamaSrc: string;
  osamaSrcMobile: string;
  osamaAlt: string;
}

// Degrees of ring rotation per pixel of horizontal drag or swipe.
const DRAG_RATE = 0.32;

export default function OrbitScene({ items, osamaSrc, osamaSrcMobile, osamaAlt }: OrbitSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const [reduced, setReduced] = useState(false);
  const [ringActive, setRingActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    // Only promote to the interactive ring once we know reduced-motion is
    // off. The grid stays as the very first paint either way, so a
    // reduced-motion visitor never sees the ring, not even for one frame.
    if (!mq.matches) setRingActive(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced || !ringActive) return;
    const scene = sceneRef.current;
    const ring = ringRef.current;
    if (!scene || !ring) return;
    const act = scene.closest("[data-sc-act]") as HTMLElement | null;
    const cards = cardRefs.current;
    const n = cards.length || 1;

    let raf = 0;
    let dragDeg = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartDeg = 0;
    let touchDirDecided = false;
    let touchIsHorizontal = false;
    let touchStartX = 0;
    let touchStartY = 0;

    const readP = () => {
      if (!act) return 0;
      const raw = getComputedStyle(act).getPropertyValue("--sc-p").trim();
      const v = parseFloat(raw);
      return Number.isFinite(v) ? v : 0;
    };

    const render = () => {
      raf = 0;
      const deg = readP() * 360 + dragDeg;
      ring.style.setProperty("--ring-deg", deg.toFixed(2) + "deg");
      for (let i = 0; i < cards.length; i++) {
        const baseAngle = (360 / n) * i;
        const effective = (((baseAngle - deg) % 360) + 360) % 360;
        const depth = Math.cos((effective * Math.PI) / 180); // 1 front, -1 back
        const t = (depth + 1) / 2;
        const el = cards[i];
        el.style.opacity = (0.3 + 0.7 * t).toFixed(3);
        el.style.filter = `blur(${((1 - t) * 3.4).toFixed(2)}px) brightness(${(0.62 + 0.38 * t).toFixed(2)})`;
        el.style.zIndex = String(Math.round(t * 100));
        el.style.pointerEvents = t > 0.16 ? "auto" : "none";
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartDeg = dragDeg;
      scene.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      dragDeg = dragStartDeg + (e.clientX - dragStartX) * DRAG_RATE;
      schedule();
    };
    const onMouseUp = () => {
      dragging = false;
      scene.style.cursor = "";
    };
    scene.addEventListener("mousedown", onMouseDown);
    addEventListener("mousemove", onMouseMove);
    addEventListener("mouseup", onMouseUp);

    // Touch: decide the gesture's direction from its first few pixels. A
    // horizontal swipe hijacks the ring and blocks the page scroll for that
    // gesture; a vertical one is left alone so the page keeps scrolling.
    const onTouchStart = (e: TouchEvent) => {
      const t0 = e.touches[0];
      touchStartX = t0.clientX;
      touchStartY = t0.clientY;
      touchDirDecided = false;
      touchIsHorizontal = false;
      dragStartDeg = dragDeg;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t0 = e.touches[0];
      const dx = t0.clientX - touchStartX;
      const dy = t0.clientY - touchStartY;
      if (!touchDirDecided) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        touchIsHorizontal = Math.abs(dx) > Math.abs(dy) * 1.3;
        touchDirDecided = true;
      }
      if (touchIsHorizontal) {
        e.preventDefault();
        dragDeg = dragStartDeg + dx * DRAG_RATE;
        schedule();
      }
    };
    scene.addEventListener("touchstart", onTouchStart, { passive: true });
    scene.addEventListener("touchmove", onTouchMove, { passive: false });

    render();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("mousemove", onMouseMove);
      removeEventListener("mouseup", onMouseUp);
      scene.removeEventListener("mousedown", onMouseDown);
      scene.removeEventListener("touchstart", onTouchStart);
      scene.removeEventListener("touchmove", onTouchMove);
    };
  }, [reduced, ringActive, items.length]);

  const n = items.length || 1;

  return (
    <div className="orbit-wrap">
      {/* Base layer: a plain grid. This is what reduced-motion visitors see,
          what renders before JS decides the ring is safe to run, and the
          fallback if it never does. Every link here is real and reachable. */}
      <div className={`orbit-grid${ringActive && !reduced ? " is-hidden" : ""}`}>
        <figure className="orbit-grid__figure">
          <img src={osamaSrc} srcSet={`${osamaSrcMobile} 700w, ${osamaSrc} 960w`} sizes="(max-width: 860px) 60vw, 22vw" alt={osamaAlt} loading="lazy" width={960} height={956} />
        </figure>
        <ul className="orbit-grid__list">
          {items.map((item) => (
            <li key={item.id}>
              <a href={item.href}>
                <img src={item.image} alt={item.imageAlt} loading="lazy" width={480} height={320} />
                <span className="orbit-card__kicker">{item.kicker}</span>
                <span className="orbit-card__title">{item.title}</span>
                <span className="orbit-card__meta">{item.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {ringActive && !reduced && (
        <div className="orbit-3d" ref={sceneRef} aria-hidden={false}>
          <div className="orbit-ring" ref={ringRef}>
            <div className="orbit-figure">
              <img src={osamaSrc} srcSet={`${osamaSrcMobile} 700w, ${osamaSrc} 960w`} sizes="(max-width: 860px) 46vw, 20vw" alt={osamaAlt} loading="lazy" width={960} height={956} />
            </div>
            {items.map((item, i) => (
              <a
                key={item.id}
                className="orbit-card"
                href={item.href}
                style={{ "--card-angle": `${(360 / n) * i}deg` } as React.CSSProperties}
                ref={(el) => {
                  if (el) cardRefs.current[i] = el;
                }}
              >
                <img src={item.image} alt={item.imageAlt} loading="lazy" width={480} height={320} />
                <span className="orbit-card__kicker">{item.kicker}</span>
                <span className="orbit-card__title">{item.title}</span>
                <span className="orbit-card__meta">{item.meta}</span>
              </a>
            ))}
          </div>
          <p className="orbit-hint microcopy">Scroll, or drag sideways</p>
        </div>
      )}
    </div>
  );
}
