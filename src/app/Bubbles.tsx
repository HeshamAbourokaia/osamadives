"use client";

import { useEffect, useRef } from "react";

interface Props {
  /** how many bubbles are alive at once */
  count?: number;
  /** 0..1, how bright the bubbles paint */
  strength?: number;
  className?: string;
}

interface Bubble { x: number; y: number; r: number; v: number; wob: number; phase: number; a: number }

// Exhaled air on its way up. A canvas the size of its act, drawn only while the act is
// on screen, and not at all for a reduced-motion visitor (the poster and the clip already
// say "underwater" without it).
export default function Bubbles({ count = 26, strength = 0.9, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, visible = false;
    let bubbles: Bubble[] = [];

    const spawn = (b: Bubble, fresh: boolean) => {
      b.r = 2 + Math.random() * Math.random() * 12;
      b.x = Math.random() * w;
      b.y = fresh ? Math.random() * h : h + b.r * 2 + Math.random() * h * 0.2;
      b.v = 18 + Math.random() * 42 + b.r * 3;          // px per second, bigger rises faster
      b.wob = 6 + Math.random() * 14;
      b.phase = Math.random() * Math.PI * 2;
      b.a = 0.25 + Math.random() * 0.45;
      return b;
    };

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(count * Math.min(1.6, Math.max(0.6, w / 900)));
      bubbles = Array.from({ length: n }, () => spawn({ x: 0, y: 0, r: 0, v: 0, wob: 0, phase: 0, a: 0 }, true));
    };

    const draw = (t: number) => {
      raf = 0;
      if (!visible) return;
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.y -= b.v * dt;
        b.phase += dt * (0.8 + b.wob / 20);
        const x = b.x + Math.sin(b.phase) * b.wob;
        if (b.y < -b.r * 2) spawn(b, false);
        const g = ctx.createRadialGradient(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, x, b.y, b.r);
        g.addColorStop(0, `rgba(255,255,255,${(0.85 * b.a * strength).toFixed(3)})`);
        g.addColorStop(0.55, `rgba(210,240,236,${(0.18 * b.a * strength).toFixed(3)})`);
        g.addColorStop(0.92, `rgba(255,255,255,${(0.55 * b.a * strength).toFixed(3)})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible && !raf) { last = 0; raf = requestAnimationFrame(draw); }
    }, { rootMargin: "10% 0px" });

    size();
    io.observe(canvas);
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, strength]);

  return <canvas ref={ref} className={`bubbles${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
