"use client";

import { useState } from "react";

const DAHAB = { lat: 28.49, lon: 34.52 };

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

/**
 * How far is Dahab from you? One tap, the phone's own permission, and a needle swings
 * toward Dahab with the distance and a rough flight time. The location never leaves the
 * phone: the sum is done here and nothing is sent anywhere.
 */
export default function HowFar() {
  const [state, setState] = useState<{ km: number; deg: number } | "asking" | "no" | "none" | null>(null);
  const ask = () => {
    if (!("geolocation" in navigator)) { setState("none"); return; }
    setState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setState({ km: haversine(latitude, longitude, DAHAB.lat, DAHAB.lon), deg: bearing(latitude, longitude, DAHAB.lat, DAHAB.lon) });
      },
      () => setState("no"),
      { maximumAge: 600000, timeout: 12000, enableHighAccuracy: false },
    );
  };
  const line = (r: { km: number; deg: number }) => {
    if (r.km < 25) return "You are in Dahab already. The water is a walk away.";
    if (r.km < 350) return `${Math.round(r.km)} km to the ${way(r.deg)}: a drive along the coast, most of it with the sea beside you.`;
    const hours = Math.max(1, Math.round(r.km / 800 + 0.5));
    return `${Math.round(r.km).toLocaleString("en-GB")} km to the ${way(r.deg)}. About ${hours} ${hours === 1 ? "hour" : "hours"} in the air to Sharm el Sheikh, then an hour along the coast to Dahab.`;
  };
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
      {typeof state === "object" && state !== null ? (
        <div className="howfar__answer" aria-live="polite">
          {/* you at one end, Dahab at the other, and a plane that makes the trip once */}
          <svg className="howfar__arc" viewBox="0 0 320 92" aria-hidden="true" focusable="false">
            <path d="M22 74 Q160 -18 298 74" fill="none" stroke="rgba(10,125,112,0.5)" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
            <circle cx="22" cy="74" r="6" fill="#10233a" />
            <text x="22" y="89" textAnchor="middle" fontSize="10" fontWeight="700" fill="#10233a" fontFamily="ui-monospace, monospace">YOU</text>
            <circle className="howfar__dot--dahab" cx="298" cy="74" r="6" fill="rgba(63,209,190,0.6)" />
            <circle cx="298" cy="74" r="5" fill="#0a7d70" />
            <text x="298" y="89" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0a7d70" fontFamily="ui-monospace, monospace">DAHAB</text>
            <g className="howfar__plane"><path d="M10 0 L3 -1.5 L-5 -7 L-8 -6 L-3 -1 L-9 -0.5 L-11 -3 L-13 -3 L-12 0 L-13 3 L-11 3 L-9 0.5 L-3 1 L-8 6 L-5 7 L3 1.5 Z" fill="#10233a" /></g>
          </svg>
          <div className="howfar__row">
            <span className="howfar__dial" aria-hidden="true">
              <span className="howfar__arrow" style={{ transform: `rotate(${state.deg}deg)` }} />
              <span className="howfar__n">N</span>
            </span>
            <p className="howfar__line">{line(state)}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
