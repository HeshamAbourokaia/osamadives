"use client";

import { useState } from "react";

const DAHAB = { lat: 28.49, lon: 34.52 };
const ZONE = "Africa/Cairo";

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function bearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
const COMPASS = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
const way = (deg: number) => COMPASS[Math.round(deg / 45) % 8];

/** Minutes that a named zone sits east of UTC at this moment, daylight saving included. */
function offsetMinutes(zone: string, at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUTC - at.getTime()) / 60000);
}

/** Two clocks and the gap between them, read on the phone, sent nowhere. */
function clocks() {
  const at = new Date();
  const fmt = (zone?: string) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "numeric", minute: "2-digit", hour12: true }).format(at).toUpperCase();
  const hourIn = (zone?: string) =>
    Number(new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", hourCycle: "h23" }).formatToParts(at).find((p) => p.type === "hour")?.value ?? 12);
  const gap = (offsetMinutes(ZONE, at) + at.getTimezoneOffset()) / 60;
  return { here: fmt(), there: fmt(ZONE), hereHour: hourIn(), thereHour: hourIn(ZONE), gap };
}

const lit = (hour: number) => hour >= 6 && hour < 19;

/** "1 hour ahead of you", "3 and a half hours behind you", or the same clock. */
function gapLine(gap: number) {
  if (Math.abs(gap) < 0.25) return "the same clock as you";
  const n = Math.abs(gap);
  const whole = Math.floor(n + 0.001);
  const half = n - whole >= 0.4;
  const word = whole === 0 ? "half an hour" : `${whole}${half ? " and a half" : ""} ${whole === 1 && !half ? "hour" : "hours"}`;
  return `${word} ${gap > 0 ? "ahead of" : "behind"} you`;
}

/** Wheels up to wheels down, near enough: the great circle at cruise, plus the ground. */
function flightHours(km: number) {
  const h = Math.round((km / 800 + 0.75) * 2) / 2;
  const whole = Math.floor(h);
  const half = h - whole >= 0.5;
  if (whole === 0) return "half an hour";
  return `${whole}${half ? " and a half" : ""} ${whole === 1 && !half ? "hour" : "hours"}`;
}

type Fix = { km: number; deg: number; c: ReturnType<typeof clocks> };

/**
 * How far is Dahab from you, and what hour is it there while you read this? One tap, the
 * phone's own permission, and a drawn route: your end, a dashed arc, a plane that makes
 * the trip once, and Dahab at the other end. Underneath, the two clocks side by side with
 * the sun or the moon over each, so the distance stops being a number and becomes a time
 * of day. The location never leaves the phone: every sum is done here and nothing is sent
 * anywhere.
 */
export default function HowFar() {
  const [state, setState] = useState<Fix | "asking" | "no" | "none" | null>(null);
  const ask = () => {
    if (!("geolocation" in navigator)) { setState("none"); return; }
    setState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setState({ km: haversine(latitude, longitude, DAHAB.lat, DAHAB.lon), deg: bearing(latitude, longitude, DAHAB.lat, DAHAB.lon), c: clocks() });
      },
      () => setState("no"),
      { maximumAge: 600000, timeout: 12000, enableHighAccuracy: false },
    );
  };
  const line = (r: Fix) => {
    if (r.km < 25) return "You are in Dahab already. The water is a walk away.";
    if (r.km < 350) return `${Math.round(r.km)} km to the ${way(r.deg)}: a drive along the coast, most of it with the sea beside you.`;
    return `${Math.round(r.km).toLocaleString("en-GB")} km to the ${way(r.deg)}. About ${flightHours(r.km)} in the air to Sharm el Sheikh, then an hour along the shore to Dahab.`;
  };
  const fix = typeof state === "object" && state !== null ? state : null;
  return (
    <div className="howfar">
      {state === null || state === "asking" ? (
        <button type="button" className="howfar__ask" onClick={ask} disabled={state === "asking"}>
          <span className="howfar__needle" aria-hidden="true" />
          {state === "asking" ? "Finding you…" : "How far is Dahab from you?"}
        </button>
      ) : null}
      {state === "no" ? <p className="howfar__line">Your phone kept your location to itself, which is fine. Dahab is on the east coast of Sinai, an hour along the shore from Sharm el Sheikh airport.</p> : null}
      {state === "none" ? <p className="howfar__line">This browser cannot say where you are. Dahab is on the east coast of Sinai, an hour along the shore from Sharm el Sheikh airport.</p> : null}
      {fix ? (
        <div className="howfar__answer" aria-live="polite">
          {/* the route, drawn: you at one end, the sea and the sand at the other, and a
              plane that makes the crossing once */}
          <svg className="howfar__arc" viewBox="0 0 320 104" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="hf-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fdcf2" /><stop offset="1" stopColor="#42b9dd" /></linearGradient>
            </defs>
            {/* his end of the world: a strip of sea, a wedge of sand, a palm */}
            <path d="M246 82 h74 v10 h-74 z" fill="url(#hf-sea)" opacity="0.7" />
            <path d="M268 92 q26 -8 52 -3 v15 h-52 z" fill="#f3dda8" />
            <path d="M306 96 q-3 -12 1 -20" stroke="#9a7a50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <g fill="#2f9160"><path d="M307 76 q-11 -3 -16 4 q9 -2 16 0 z" /><path d="M307 76 q9 -9 18 -6 q-9 3 -17 7 z" /><path d="M307 76 q-5 -11 -14 -12 q6 7 13 13 z" /></g>
            {/* the sky over each of you, at this minute */}
            {fix.c && (lit(fix.c.hereHour)
              ? <g><circle cx="22" cy="24" r="8" fill="#ffd24a" /><circle cx="22" cy="24" r="13" fill="#ffd24a" opacity="0.22" /></g>
              : <g><circle cx="22" cy="24" r="8" fill="#c9d6e6" /><circle cx="26" cy="21" r="7" fill="#eef5fb" /></g>)}
            {fix.c && (lit(fix.c.thereHour)
              ? <g><circle cx="298" cy="24" r="8" fill="#ffd24a" /><circle cx="298" cy="24" r="13" fill="#ffd24a" opacity="0.22" /></g>
              : <g><circle cx="298" cy="24" r="8" fill="#c9d6e6" /><circle cx="302" cy="21" r="7" fill="#eef5fb" /></g>)}
            <path d="M22 74 Q160 -18 298 74" fill="none" stroke="rgba(10,125,112,0.5)" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
            <circle cx="22" cy="74" r="6" fill="#10233a" />
            <text x="22" y="103" textAnchor="middle" fontSize="10" fontWeight="700" fill="#10233a" fontFamily="ui-monospace, monospace">YOU</text>
            <circle className="howfar__dot--dahab" cx="298" cy="74" r="6" fill="rgba(63,209,190,0.6)" />
            <circle cx="298" cy="74" r="5" fill="#0a7d70" />
            <text x="298" y="103" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0a7d70" fontFamily="ui-monospace, monospace">DAHAB</text>
            <g className="howfar__plane"><path d="M10 0 L3 -1.5 L-5 -7 L-8 -6 L-3 -1 L-9 -0.5 L-11 -3 L-13 -3 L-12 0 L-13 3 L-11 3 L-9 0.5 L-3 1 L-8 6 L-5 7 L3 1.5 Z" fill="#10233a" /></g>
          </svg>
          {/* the two clocks: the distance said as a time of day */}
          <div className="howfar__clocks">
            <span className="howfar__clock"><b>{fix.c.here}</b>where you are</span>
            <span className="howfar__gap">{gapLine(fix.c.gap)}</span>
            <span className="howfar__clock howfar__clock--there"><b>{fix.c.there}</b>in Dahab</span>
          </div>
          <div className="howfar__row">
            <span className="howfar__dial" aria-hidden="true">
              <span className="howfar__arrow" style={{ transform: `rotate(${fix.deg}deg)` }} />
              <span className="howfar__n">N</span>
            </span>
            <p className="howfar__line">{line(fix)}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
