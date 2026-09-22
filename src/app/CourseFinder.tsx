"use client";

import { useEffect, useState } from "react";
import { whatsappFor, togglePick, readPicks } from "@/lib/picks";
import { writeLevel } from "@/lib/level";

import { courseAnswer, type Dived, type Card, type Days } from "@/lib/course-finder";

const Q = ({ k, children }: { k: string; children: React.ReactNode }) => (
  <div className="finder__q"><span className="finder__k mono">{k}</span><div className="finder__opts">{children}</div></div>
);

export default function CourseFinder() {
  const [dived, setDived] = useState<Dived | null>(null);
  const [want, setWant] = useState<"try" | "cert" | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [days, setDays] = useState<Days | null>(null);
  const [added, setAdded] = useState(false);
  const stepTwoDone = dived === "card" ? card !== null : want !== null;
  const done = dived !== null && stepTwoDone && days !== null;
  const result = done ? courseAnswer(dived, want, card, days) : null;
  useEffect(() => { if (result) { writeLevel(result.level); setAdded(result.course ? readPicks().some((p) => p.id === result.course!.id) : false); } }, [result?.title, result?.level, result?.course?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const reset = () => { setDived(null); setWant(null); setCard(null); setDays(null); };
  const opt = (on: boolean, onClick: () => void, label: string) => (
    <button type="button" className={`finder__opt${on ? " is-on" : ""}`} aria-pressed={on} onClick={onClick}>{label}</button>
  );
  return (
    <section className="finder" aria-label="Which dive is right for me">
      <div className="finder__head">
        <span className="microcopy">Three taps</span>
        <h3 className="finder__title">Which dive is right for me?</h3>
      </div>
      <Q k="Have you dived before?">
        {opt(dived === "never", () => { setDived("never"); setCard(null); }, "Never")}
        {opt(dived === "few", () => { setDived("few"); setCard(null); }, "Once or twice, no card")}
        {opt(dived === "card", () => { setDived("card"); setWant(null); }, "I have a card")}
      </Q>
      {dived && dived !== "card" ? (
        <Q k="What do you want from it?">
          {opt(want === "try", () => setWant("try"), "Just to try it")}
          {opt(want === "cert", () => setWant("cert"), "To be certified")}
        </Q>
      ) : null}
      {dived === "card" ? (
        <Q k="Which card?">
          {opt(card === "ow", () => setCard("ow"), "Open Water")}
          {opt(card === "aow", () => setCard("aow"), "Advanced")}
          {opt(card === "pro", () => setCard("pro"), "Rescue or above")}
        </Q>
      ) : null}
      {dived && stepTwoDone ? (
        <Q k="How many days do you have?">
          {opt(days === "1", () => setDays("1"), "One")}
          {opt(days === "3", () => setDays("3"), "Two to four")}
          {opt(days === "7", () => setDays("7"), "A week or more")}
        </Q>
      ) : null}
      {result ? (
        <div className="finder__answer" aria-live="polite">
          <span className="microcopy">Osama says</span>
          <h4 className="finder__course">{result.title}</h4>
          <p className="finder__say">{result.say}</p>
          <div className="finder__acts">
            <a className="finder__wa" href={whatsappFor(`Hi Osama! I found you on osamadives.com. ${result.ask}`)} target="_blank" rel="noopener noreferrer">Ask Osama about this</a>
            {result.course ? (
              <button type="button" className={`pick${added ? " is-on" : ""}`} aria-pressed={added} onClick={() => { const { added: a, list } = togglePick({ ...result.course!, kind: "course" }); setAdded(a); window.dispatchEvent(new CustomEvent("od:picked", { detail: { label: result.course!.label, added: a, count: list.length } })); }}>
                <span className="pick__mark" aria-hidden="true">{added ? "✓" : "+"}</span><span className="pick__word">{added ? "In your message" : "Add to my message"}</span>
              </button>
            ) : null}
          </div>
          <button type="button" className="finder__again" onClick={reset}>Start again</button>
          <p className="finder__note">Courses and dives are arranged through CDWS-registered dive centres in Dahab.</p>
        </div>
      ) : null}
    </section>
  );
}
