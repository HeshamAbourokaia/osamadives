"use client";

import { useEffect, useState } from "react";
import DahabScene, { type Phase } from "./DahabScene";

type Now = { ok: true; water: number; wave: number; air: number; wind: number; isDay: boolean; sunrise: string; sunset: string } | { ok: false };

const ZONE = "Africa/Cairo";

function dahabClock() {
  const now = new Date();
  const h24 = Number(new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, hour: "2-digit", hourCycle: "h23" }).formatToParts(now).find((p) => p.type === "hour")?.value ?? 0);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(now);
  const h = parts.find((p) => p.type === "hour")?.value ?? "12";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  const ap = (parts.find((p) => p.type === "dayPeriod")?.value ?? "").toUpperCase();
  return { text: `${h}:${m} ${ap}`, hour: h24, minute: Number(m) };
}

const mins = (t: string) => { const [h, m] = t.split(":").map(Number); return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN; };

/** Day, the golden hour around sunrise and sunset, or night: what the drawing wears. */
function phaseOf(clock: { hour: number; minute: number } | null, now: Now | null): Phase {
  if (!clock) return "day";
  const t = clock.hour * 60 + clock.minute;
  if (now && now.ok) {
    const rise = mins(now.sunrise), set = mins(now.sunset);
    if ((Number.isFinite(rise) && Math.abs(t - rise) <= 50) || (Number.isFinite(set) && Math.abs(t - set) <= 50)) return "golden";
    return now.isDay ? "day" : "night";
  }
  return clock.hour >= 6 && clock.hour < 18 ? "day" : "night";
}

/** "18:53" reads as "6:53 PM" */
function ampm(t: string) {
  const [hh, mm] = t.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return t;
  const h = hh % 12 || 12;
  return `${h}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
}

/* Where Osama probably is, from Dahab's clock alone. Nothing is tracked and nothing is
   promised; it sets the expectation for a WhatsApp answer honestly. */
function whereHeIs(hour: number) {
  if (hour >= 7 && hour < 16) return "Osama is probably in the water. He answers after the dive.";
  if (hour >= 16 && hour < 19) return "Osama is probably back on the sand, rinsing gear. He answers soon.";
  if (hour >= 19 && hour < 23) return "Osama is probably at Shark Restaurant. He answers tonight.";
  return "It is night in Dahab. Osama answers in the morning.";
}

const sea = (wave: number) => (wave < 0.3 ? "flat" : wave < 0.6 ? "calm" : wave < 1 ? "a little chop" : "rough");

/**
 * Dahab, right now. The clock runs on the phone; the sea and the sky come from the
 * site's own reading of a public forecast, shared by every visitor. One line a diver
 * reads before anything else: is the water warm, is the sea flat, when does the light go.
 */
export default function DahabNow() {
  const [now, setNow] = useState<Now | null>(null);
  // The clock is read on the phone only, after the page is on screen: a time rendered
  // on the server would not match the one the phone shows a second later.
  const [clock, setClock] = useState<{ text: string; hour: number; minute: number } | null>(null);
  useEffect(() => {
    const tick = () => setClock(dahabClock());
    tick();
    const id = window.setInterval(tick, 30000);
    fetch("/api/dahab").then((r) => r.json()).then((d: Now) => setNow(d)).catch(() => setNow({ ok: false }));
    return () => window.clearInterval(id);
  }, []);
  const [forced, setForced] = useState<Phase | null>(null);
  useEffect(() => { const p = new URLSearchParams(window.location.search).get("phase"); if (p === "day" || p === "golden" || p === "night") setForced(p); }, []);
  const phase = forced ?? phaseOf(clock, now);
  return (
    <div className={`dahab-now dahab-now--${phase}`} aria-live="polite">
      <div className="dahab-now__scene">
        <DahabScene phase={phase} water={now && now.ok ? now.water : undefined} air={now && now.ok ? now.air : undefined} />
        <div className="dahab-now__head">
          <span className="dahab-now__k">Dahab, right now</span>
          <span className="dahab-now__t" aria-label={clock ? `The time in Dahab is ${clock.text}` : "Reading the time in Dahab"}>{clock ? clock.text : "--:--"}</span>
        </div>
      </div>
      <div className="dahab-now__body">
        {now && now.ok ? (
          <p className="dahab-now__sea">
            Water {now.water}° · sea {sea(now.wave)} · air {now.air}° · {now.isDay ? `sunset ${ampm(now.sunset)}` : `sunrise ${ampm(now.sunrise)}`}
          </p>
        ) : (
          <p className="dahab-now__sea dahab-now__sea--quiet">{now ? "The sea reading is resting." : "Reading the sea…"}</p>
        )}
        <p className="dahab-now__osama">{clock ? whereHeIs(clock.hour) : "\u00a0"}</p>
      </div>
    </div>
  );
}
