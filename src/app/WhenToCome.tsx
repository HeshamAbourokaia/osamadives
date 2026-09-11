"use client";

import { useState } from "react";
import { whatsappFor } from "@/lib/picks";

/**
 * When are you coming? Pick a month and the shore answers: the water, the air, what
 * to wear in it, when the light goes, and what Osama would tell you about that month.
 * Typical figures for Dahab, not a forecast; the live line at the top of the site is
 * the forecast. Built for people who live where the sun does not: the answer to
 * "is it warm enough" is here before they ask.
 */
const MONTHS = [
  { m: "Jan", water: 22, air: 21, light: "6:45 am to 5:15 pm", sea: "the north wind can chop the afternoons; mornings are calm", says: "Cold for Dahab, quiet reefs, the best visibility of the year and nobody on the sites." },
  { m: "Feb", water: 21, air: 22, light: "6:35 am to 5:40 pm", sea: "clear water, some windy days", says: "The coolest water of the year, and the clearest. Bring a hood and you will have the Canyon to yourself." },
  { m: "Mar", water: 22, air: 26, light: "6:05 am to 6:00 pm", sea: "warming, the wind picks up some afternoons", says: "Spring on the shore. Warm on land by lunch, still crisp in the water; the kites come out." },
  { m: "Apr", water: 23, air: 30, light: "6:30 am to 7:20 pm", sea: "flat mornings, breezy afternoons", says: "Long days begin. The sea is still fresh, the sand is warm, and the sites are quiet before summer." },
  { m: "May", water: 25, air: 34, light: "6:00 am to 7:40 pm", sea: "often flat in the morning", says: "Warm water, long days, and the Blue Hole at its calmest early in the morning." },
  { m: "Jun", water: 26, air: 37, light: "5:45 am to 7:55 pm", sea: "flat and clear", says: "Hot on land, perfect in the water. We dive early and rest in the shade after." },
  { m: "Jul", water: 27, air: 38, light: "5:55 am to 7:55 pm", sea: "flat and clear", says: "Peak summer. Two dives before eleven, then the afternoon belongs to the tea." },
  { m: "Aug", water: 28, air: 38, light: "6:10 am to 7:35 pm", sea: "flat and warm", says: "The warmest water of the year. A shorty is enough for most; the fish are everywhere." },
  { m: "Sep", water: 28, air: 36, light: "6:25 am to 6:55 pm", sea: "calm, the summer crowd gone", says: "My favourite month. Warm water, calm sea, easy light and the sites back to their quiet." },
  { m: "Oct", water: 27, air: 32, light: "6:40 am to 6:20 pm", sea: "calm and clear", says: "Still warm in the water, cooler evenings, the best of both. October fills the logbook." },
  { m: "Nov", water: 25, air: 27, light: "6:20 am to 4:55 pm", sea: "clear, the odd windy day", says: "Sun without the heat. The water holds its warmth long after the air lets go." },
  { m: "Dec", water: 23, air: 23, light: "6:40 am to 4:55 pm", sea: "clear, some wind", says: "Winter light and empty reefs. A 5 mm suit and the sites are yours." },
];

function suit(water: number) {
  if (water >= 27) return "a 3 mm shorty or a thin full suit";
  if (water >= 24) return "a 3 mm full suit, 5 mm if you feel the cold";
  return "a 5 mm full suit, and a hood for the second dive";
}

export default function WhenToCome() {
  const [i, setI] = useState<number | null>(null);
  const m = i === null ? null : MONTHS[i];
  return (
    <section className="when" aria-label="When are you coming">
      <div className="when__head">
        <span className="microcopy">The year on this shore</span>
        <h3 className="when__title">When are you coming?</h3>
      </div>
      <div className="when__months" role="group" aria-label="Month">
        {MONTHS.map((x, k) => (
          <button key={x.m} type="button" className={`when__m${i === k ? " is-on" : ""}`} aria-pressed={i === k} onClick={() => setI(i === k ? null : k)}>{x.m}</button>
        ))}
      </div>
      {m ? (
        <div className="when__answer" aria-live="polite">
          <ul className="when__facts">
            <li><span className="mono">Water</span><strong>{m.water}°</strong></li>
            <li><span className="mono">Air</span><strong>{m.air}°</strong></li>
            <li><span className="mono">Light</span><strong>{m.light}</strong></li>
            <li><span className="mono">Wear</span><strong>{suit(m.water)}</strong></li>
            <li><span className="mono">Sea</span><strong>{m.sea}</strong></li>
          </ul>
          <p className="when__says"><span className="microcopy">Osama says</span>{m.says}</p>
          <a className="when__wa" href={whatsappFor(`Hi Osama! I found you on osamadives.com. I am thinking of coming in ${m.m === "Sep" ? "September" : m.m === "Jan" ? "January" : m.m === "Feb" ? "February" : m.m === "Mar" ? "March" : m.m === "Apr" ? "April" : m.m === "Jun" ? "June" : m.m === "Jul" ? "July" : m.m === "Aug" ? "August" : m.m === "Oct" ? "October" : m.m === "Nov" ? "November" : m.m === "Dec" ? "December" : "May"}. Is that a good month to dive with you?`)} target="_blank" rel="noopener noreferrer">Ask Osama about {m.m}</a>
          <p className="when__note">Typical figures for Dahab, not a forecast. The live line on the home page is the forecast.</p>
        </div>
      ) : null}
    </section>
  );
}
