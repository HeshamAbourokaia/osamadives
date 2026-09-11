"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A day with Osama, live. The day laid out hour by hour in his own photographs, and it
 * opens on the hour it is in Dahab right now, so whoever is reading sees what he is
 * probably doing at this moment. Told by the clock, not sold.
 */
const HOURS: { at: number; time: string; line: string; img: string; alt: string }[] = [
  { at: 6.5, time: "6:30 AM", line: "First light on the gulf. The wind is still asleep and the water is glass.", img: "/descent/dahab-lagoon.webp", alt: "The lagoon at Dahab at first light" },
  { at: 8, time: "8:00 AM", line: "On the sand at Assalah, gear on, the briefing drawn in the sand.", img: "/descent/peak-now-m.webp", alt: "Osama in his wetsuit on the shore before a dive, the Sinai mountains behind him" },
  { at: 9.5, time: "9:30 AM", line: "First dive. Om El Seed, seven metres, where every first breath starts.", img: "/descent/depth-7-m.webp", alt: "A turtle over the reef at Om El Seed" },
  { at: 12, time: "12:00 PM", line: "Tea, a surface interval, and the second dive: the edge of the Blue Hole.", img: "/descent/depth-8-m.webp", alt: "Coral on the reef shelf at the edge of the Blue Hole" },
  { at: 14, time: "2:00 PM", line: "Tanks back on the truck. Lunch is long in Dahab.", img: "/descent/osama-truck-m.webp", alt: "Osama on the back of a truck with the dive gear" },
  { at: 16, time: "4:00 PM", line: "Gear rinsed, tanks lined up for tomorrow, logbooks open on the table.", img: "/descent/seven-tanks-m.webp", alt: "Seven scuba tanks lined up" },
  { at: 17, time: "5:00 PM", line: "Stamps and signatures. A certificate photograph on the street at Assalah.", img: "/descent/padi-first-fins.webp", alt: "A young student in a small wetsuit standing proudly in the street at Assalah" },
  { at: 19, time: "7:00 PM", line: "The sun goes behind the mountains. Shark Restaurant, the family table since 1983.", img: "/logbook/dahab-camels.webp", alt: "Camels walking the Dahab shore at dusk" },
];

function dahabHour() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour")?.value ?? 0) + Number(parts.find((p) => p.type === "minute")?.value ?? 0) / 60;
}

export default function DayStrip() {
  const [now, setNow] = useState<number | null>(null);
  const strip = useRef<HTMLUListElement>(null);
  useEffect(() => { setNow(dahabHour()); const id = window.setInterval(() => setNow(dahabHour()), 60000); return () => window.clearInterval(id); }, []);
  const current = now === null ? -1 : HOURS.reduce((best, h, i) => (h.at <= now ? i : best), -1);
  useEffect(() => {
    const el = strip.current;
    if (!el || current < 0) return;
    const card = el.children[current] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - 16, behavior: "auto" });
  }, [current]);
  const night = now !== null && (now < 6 || now >= 22);
  return (
    <section className="day" aria-label="A day with Osama">
      <div className="day__head">
        <span className="microcopy">A day with Osama · Dahab time</span>
        <h3 className="day__title">{night ? "It is night in Dahab. This is how his day goes." : "This is where his day probably is right now."}</h3>
      </div>
      <ul className="day__strip" ref={strip}>
        {HOURS.map((h, i) => (
          <li key={h.time} className={`day__card${i === current ? " is-now" : ""}${i < current ? " is-past" : ""}`}>
            <img src={h.img} alt={h.alt} loading="lazy" decoding="async" />
            <span className="day__time mono">{h.time}{i === current ? " · now" : ""}</span>
            <p className="day__line">{h.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
