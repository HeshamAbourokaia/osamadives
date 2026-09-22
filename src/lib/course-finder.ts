import type { Level } from "./level";

export type Dived = "never" | "few" | "card";
export type Card = "ow" | "aow" | "pro";
export type Days = "1" | "3" | "7";

type Answer = { title: string; course?: { id: string; label: string }; say: string; ask: string; level: Level };

/**
 * Which course am I? Three taps and a plain answer in Osama's voice, with the WhatsApp
 * message already written. No prices and no booking: it tells people what fits, and
 * hands them the conversation.
 */
export function courseAnswer(dived: Dived, want: "try" | "cert" | null, card: Card | null, days: Days): Answer {
  if (dived !== "card") {
    const experience = dived === "few" ? "I have tried diving once or twice but am not certified" : "I have never dived";
    const level: Level = dived === "few" ? "tried" : "new";
    if (want === "try" || days === "1") {
      return {
        title: "An intro dive",
        course: { id: "course:intro-dive", label: "Intro dive" },
        say: days === "1" && want === "cert" ? "One day is not enough for a certification, and I would rather you had the day than a rushed card. An intro dive at the Lighthouse gives you a real first breath under water, and Open Water waits for your next visit." : "Half a day at the Lighthouse, a first breath under water with me beside you, no certification and no promise that you will love it. Most people do.",
        ask: `${experience}. Could I do an intro dive with you?`,
        level,
      };
    }
    return {
      title: "Open Water",
      course: { id: "course:open-water", label: "Open Water" },
      say: days === "3" ? "Three to four days, the certification that works anywhere in the world. If you only have two days, tell me first so we can plan a suitable introduction. You leave able to dive, not just able to say you have." : "A week is the good way to do it: Open Water in the first days, then a few easy dives on the shore to make it yours before you go home.",
      ask: `${experience} and I have ${days === "3" ? "a few days" : "about a week"}. Is Open Water right for me?`,
      level,
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

