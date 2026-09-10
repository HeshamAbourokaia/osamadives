"use client";

import { useEffect, useState } from "react";

type Now = { ok: true; water: number; wave: number; air: number; wind: number; isDay: boolean; sunrise: string; sunset: string } | { ok: false };

const ZONE = "Africa/Cairo";

function dahabClock() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { text: `${String(h).padStart(2, "0")}:${m}`, hour: h };
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
  const [clock, setClock] = useState<{ text: string; hour: number } | null>(null);
  useEffect(() => {
    const tick = () => setClock(dahabClock());
    tick();
    const id = window.setInterval(tick, 30000);
    fetch("/api/dahab").then((r) => r.json()).then((d: Now) => setNow(d)).catch(() => setNow({ ok: false }));
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="dahab-now" aria-live="polite">
      <div className="dahab-now__head">
        <span className="dahab-now__k">Dahab, right now</span>
        <span className="dahab-now__t" aria-label={clock ? `The time in Dahab is ${clock.text}` : "Reading the time in Dahab"}>{clock ? clock.text : "--:--"}</span>
      </div>
      {now && now.ok ? (
        <p className="dahab-now__sea">
          Water {now.water}° · sea {sea(now.wave)} · air {now.air}° · {now.isDay ? `sunset ${now.sunset}` : `sunrise ${now.sunrise}`}
        </p>
      ) : (
        <p className="dahab-now__sea dahab-now__sea--quiet">{now ? "The sea reading is resting." : "Reading the sea…"}</p>
      )}
      <p className="dahab-now__osama">{clock ? whereHeIs(clock.hour) : "\u00a0"}</p>
    </div>
  );
}
