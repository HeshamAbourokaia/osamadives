"use client";

import { useEffect, useState, type FormEvent } from "react";
import { whatsappFor, togglePick, readPicks } from "@/lib/picks";
import { writeLevel } from "@/lib/level";
import { askFinder, type EnquiryNote } from "@/lib/guide/ask-jev";
import { enquiryMessage, NOTE_TEXT } from "@/lib/enquiry";

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
  // Or say it in a sentence: Jev reads it into the same taps, and only the ones it is
  // sure of are filled. Whatever it could not tell stays for the visitor to tap.
  const [story, setStory] = useState("");
  const [reading, setReading] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  // What Jev noticed that Osama should ask about, and the sentence it read, which the
  // message carries in the visitor's own words (never when it mentions their health).
  const [notes, setNotes] = useState<EnquiryNote[]>([]);
  const [told, setTold] = useState("");
  const stepTwoDone = dived === "card" ? card !== null : want !== null;
  const done = dived !== null && stepTwoDone && days !== null;
  const result = done ? courseAnswer(dived, want, card, days) : null;
  useEffect(() => { if (result) { writeLevel(result.level); setAdded(result.course ? readPicks().some((p) => p.id === result.course!.id) : false); } }, [result?.title, result?.level, result?.course?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const reset = () => { setDived(null); setWant(null); setCard(null); setDays(null); setHeard(null); setNotes([]); setTold(""); };
  const opt = (on: boolean, onClick: () => void, label: string) => (
    <button type="button" className={`finder__opt${on ? " is-on" : ""}`} aria-pressed={on} onClick={onClick}>{label}</button>
  );
  async function listen(e: FormEvent) {
    e.preventDefault();
    const text = story.trim();
    if (!text || reading) return;
    setReading(true);
    setHeard(null);
    const got = await askFinder(text);
    setReading(false);
    setNotes(got.notes ?? []);
    setTold(text);
    const filled: string[] = [];
    if (got.dived) { setDived(got.dived); setCard(null); setWant(null); filled.push(got.dived === "never" ? "never dived" : got.dived === "few" ? "tried it, no card" : "you have a card"); }
    if (got.dived === "card" && got.card) { setCard(got.card); filled.push(got.card === "ow" ? "Open Water" : got.card === "aow" ? "Advanced" : "Rescue or above"); }
    if (got.dived && got.dived !== "card" && got.want) { setWant(got.want); filled.push(got.want === "try" ? "just to try it" : "to be certified"); }
    if (got.days) { setDays(got.days); filled.push(got.days === "1" ? "one day" : got.days === "3" ? "two to four days" : "a week or more"); }
    setHeard(filled.length ? `I read: ${filled.join(", ")}. Change any tap that is wrong.` : "I could not tell from that. The taps below will get you there.");
  }
  return (
    <section className="finder" aria-label="Which dive is right for me">
      <div className="finder__head">
        <span className="microcopy">Three taps</span>
        <h3 className="finder__title">Which dive is right for me?</h3>
      </div>
      <form className="finder__say" onSubmit={listen}>
        <label className="finder__k mono" htmlFor="finder-story">Or say it in a sentence</label>
        <div className="finder__say-row">
          <input id="finder-story" type="text" className="finder__say-input" value={story} maxLength={600} onChange={(e) => setStory(e.target.value)} placeholder="Five dives in Thailand years ago, no card, four days here" autoComplete="off" />
          <button type="submit" className="finder__opt finder__say-go" disabled={reading || !story.trim()}>{reading ? "Reading" : "Work it out"}</button>
        </div>
        {heard ? <p className="finder__heard" aria-live="polite">{heard}</p> : null}
        {notes.map((n) => (
          <p key={n} className={`finder__note-read${n === "medical" ? " is-health" : ""}`}>
            {NOTE_TEXT[n].text}
            {NOTE_TEXT[n].link ? <> <a href={NOTE_TEXT[n].link!.href} target="_blank" rel="noopener noreferrer">{NOTE_TEXT[n].link!.label}</a></> : null}
          </p>
        ))}
      </form>
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
            <a className="finder__wa" href={whatsappFor(enquiryMessage(result.ask, told, notes))} target="_blank" rel="noopener noreferrer">Ask Osama about this</a>
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
