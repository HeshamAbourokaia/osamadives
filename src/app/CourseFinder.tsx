"use client";

import { useEffect, useState } from "react";
import { whatsappFor, togglePick, readPicks } from "@/lib/picks";
import { writeLevel, type Level } from "@/lib/level";

type Dived = "never" | "few" | "card";
type Card = "ow" | "aow" | "pro";
type Days = "1" | "3" | "7";

type Answer = { title: string; course?: { id: string; label: string }; say: string; ask: string; level: Level };

/**
 * Which course am I? Three taps and a plain answer in Osama's voice, with the WhatsApp
 * message already written. No prices and no booking: it tells people what fits, and
 * hands them the conversation.
 */
function answer(dived: Dived, want: "try" | "cert" | null, card: Card | null, days: Days): Answer {
  if (dived !== "card") {
    if (want === "try" || days === "1") {
      return {
        title: "An intro dive",
        course: { id: "course:intro-dive", label: "Intro dive" },
        say: days === "1" && want === "cert" ? "One day is not enough for a certification, and I would rather you had the day than a rushed card. An intro dive at the Lighthouse gives you a real first breath under water, and Open Water waits for your next visit." : "Half a day at the Lighthouse, a first breath under water with me beside you, no certification and no promise that you will love it. Most people do.",
        ask: "I have never dived. Could I do an intro dive with you?",
        level: "new",
      };
    }
    return {
      title: "Open Water",
      course: { id: "course:open-water", label: "Open Water" },
      say: days === "3" ? "Three to four days, the certification that works anywhere in the world. Two days is tight; three is right. You leave able to dive, not just able to say you have." : "A week is the good way to do it: Open Water in the first days, then a few easy dives on the shore to make it yours before you go home.",
      ask: `I have never dived and I have ${days === "3" ? "a few days" : "about a week"}. Is Open Water right for me?`,
      level: "new",
    };
  }
  if (card === "ow") {
    if (days === "1") return { title: "A day of guided dives", say: "With a day, we dive. Lighthouse, Eel Garden or Three Pools from the beach, the sites where the reef starts at your fins. I pick by the light and the wind that morning.", ask: "I am Open Water certified and I have a day in Dahab. Which sites would you take me to?", level: "ow" };
    return {
      title: "Advanced",
      course: { id: "course:advanced", label: "Advanced" },
      say: days === "3" ? "Two days and five dives, deep and navigation among them. It opens the Canyon and the depth of the Blue Hole, and it is where I teach people to look after the reef they swim over." : "A week gives you Advanced in the first two days and the whole shore after it, the Canyon and the Blue Hole included, at a pace that lets each dive settle.",
      ask: `I am Open Water certified with ${days === "3" ? "a few days" : "about a week"} in Dahab. Should I do Advanced with you?`,
      level: "ow",
    };
  }
  if (card === "aow") {
    if (days === "7") return { title: "Rescue Diver", course: { id: "course:rescue-diver", label: "Rescue Diver" }, say: "Four days that change how you see diving. Open Water taught you to look after yourself; Rescue is about looking after others, and it makes you a buddy worth diving with.", ask: "I am Advanced certified with about a week. Is Rescue the right next step with you?", level: "aow" };
    return { title: "The deep sites, guided", say: "You are ready for the Canyon and the Blue Hole. We dive them properly briefed, within your training, and I know their moods in every wind.", ask: `I am Advanced certified with ${days === "1" ? "a day" : "a few days"} in Dahab. Could you take me to the Canyon and the Blue Hole?`, level: "aow" };
  }
  if (days === "7") return { title: "Divemaster, if you want it", course: { id: "course:divemaster", label: "Divemaster" }, say: "Two weeks to a month at my side, the first professional step. If that is not the plan, come and dive: I know where the light is good and which sites are worth the walk on the day.", ask: "I am a Rescue Diver and I have time in Dahab. Could we talk about Divemaster with you?", level: "pro" };
  return { title: "Dive with me", say: "Come and dive. I know where the light is good, where the current turns, and which sites are worth the walk on the day you are here.", ask: `I am a Rescue Diver or above with ${days === "1" ? "a day" : "a few days"} in Dahab. Which dives would you suggest?`, level: "pro" };
}

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
  const result = done ? answer(dived, want, card, days) : null;
  useEffect(() => { if (result) { writeLevel(result.level); setAdded(result.course ? readPicks().some((p) => p.id === result.course!.id) : false); } }, [result?.title, result?.level, result?.course?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const reset = () => { setDived(null); setWant(null); setCard(null); setDays(null); };
  const opt = (on: boolean, onClick: () => void, label: string) => (
    <button type="button" className={`finder__opt${on ? " is-on" : ""}`} aria-pressed={on} onClick={onClick}>{label}</button>
  );
  return (
    <section className="finder" aria-label="Which course am I">
      <div className="finder__head">
        <span className="microcopy">Three taps</span>
        <h3 className="finder__title">Which course am I?</h3>
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
