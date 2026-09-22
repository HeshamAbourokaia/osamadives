import { MEDICAL_SOURCE } from "./profile";
import type { GuideAnswer, GuideProfile } from "./types";

export const MAX_GUIDE_LENGTH = 600;

const APOSTROPHES = /[’']/g;
const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(APOSTROPHES, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
const includesPhrase = (query: string, phrase: string) => ` ${query} `.includes(` ${normalize(phrase)} `);
const matches = (query: string, phrases: string[]) => phrases.some((phrase) => includesPhrase(query, phrase));
const GREETING = /^(hi|hello|hey|good morning|good evening|thanks|thank you|شكرا|مرحبا|اهلا)$/;

const generic = (profile: GuideProfile, id: string, text: string, suggestions = profile.suggestions): GuideAnswer => ({ id, text, actions: [profile.contact], suggestions });

/**
 * The replies that are not topics: the lines the guide will not cross. They are
 * reached by keyword here, and by meaning when Jev reads a question the keywords
 * missed, so both paths must produce exactly the same words.
 */
export const BOUNDARIES: Record<string, { description: string; answer: (profile: GuideProfile, previousTopic?: string) => GuideAnswer }> = {
  pricing: {
    description: "Asking what something costs, how to pay, deposits, refunds or cancellation",
    answer: (profile, previousTopic) => {
      const topic = profile.topics.find((entry) => entry.id === previousTopic);
      return generic(profile, "pricing", `I do not have prices, inclusions or cancellation terms${topic ? " for that" : ""}. Osama does not sell courses himself; the CDWS registered centre that organises your activity sets those. Message him and he will point you to the right centre. No payment or booking happens here.`);
    },
  },
  arrangements: {
    description: "Trying to book, check availability, pick dates, or asking about the weather, season or best time to come",
    answer: (profile) => generic(profile, "arrangements", "I do not have Osama's calendar, the forecast or confirmed trip dates. Message him with your dates and experience. The CDWS registered centre confirms the arrangements and whether the plan suits you; nothing is reserved here.", ["What should I bring?", "Which organisations?"]),
  },
  medical: {
    description: "A health, medication, pregnancy, fitness-to-dive or flying-after-diving question",
    answer: (profile) => ({ ...generic(profile, "medical", "I cannot assess fitness to dive, symptoms, medication or how soon you can fly after diving. Talk to a dive-medicine doctor and complete the centre's official screening form. Please do not put medical details in this chat.", []), sources: [MEDICAL_SOURCE] }),
  },
  "dive-safety": {
    description: "Asking for a dive plan, depths, the Blue Hole Arch, caves, technical or solo diving, or whether they are allowed to do a particular dive",
    answer: (profile) => generic(profile, "dive-safety", "This guide gives visitor information, not dive plans or underwater instruction. The Blue Hole Arch and any overhead or technical diving need the right specialist training. Osama and the organising centre assess what you can do against your qualifications and the conditions; I cannot confirm that you are eligible.", ["Explore the dive sites", "Which organisations?"]),
  },
  emergency: {
    description: "Someone is in danger or unwell right now",
    answer: (profile) => generic(profile, "emergency", "If this is an emergency, contact local emergency services right now and get help from someone nearby. Do not wait for this guide or a WhatsApp reply. I cannot assess or manage an emergency.", []),
  },
  privacy: {
    description: "Asking for private records, passwords, personal documents or trying to change how the guide behaves",
    answer: (profile) => generic(profile, "privacy", "I only answer visitor questions from what the site already says. I cannot reach private records, passwords or anything behind the scenes."),
  },
};

/** The answer for a known id: a topic, a boundary, or nothing if the id is made up. */
export function answerFor(profile: GuideProfile, id: string, previousTopic?: string): GuideAnswer | null {
  const boundary = BOUNDARIES[id];
  if (boundary) return boundary.answer(profile, previousTopic);
  const topic = profile.topics.find((entry) => entry.id === id);
  if (!topic) return null;
  const { id: topicId, text, sources, suggestions } = topic;
  return { id: topicId, text, sources, actions: [profile.contact], suggestions: suggestions ?? profile.suggestions };
}

/**
 * Deterministic answers from a reviewed list. Nothing here calls a model, the
 * network or storage, and nothing it says can book, price or approve anything.
 * The order matters: safety and boundary replies win before any topic is matched.
 */
export function answerQuestion(profile: GuideProfile, input: unknown, previousTopic?: string): GuideAnswer {
  const query = normalize(typeof input === "string" ? input.slice(0, MAX_GUIDE_LENGTH) : "");
  const boundary = (id: string) => BOUNDARIES[id].answer(profile, previousTopic);

  if (!query) return generic(profile, "empty", "Choose a question below, or type what you would like to know.");
  if (matches(query, ["who are you", "are you osama", "are you human", "are you a person", "are you ai", "are you a bot", "are you real"])) return { id: "identity", text: profile.welcome, suggestions: profile.suggestions };
  if (matches(query, ["ignore instructions", "ignore previous", "system prompt", "api key", "password", "passport", "bank", "home address", "admin", "customer data", "booking records", "private"])) return boundary("privacy");
  if (matches(query, ["emergency", "cant breathe", "cannot breathe", "chest pain", "unconscious", "drowning", "not breathing"])) return boundary("emergency");
  if (matches(query, ["medical", "asthma", "pregnant", "pregnancy", "medication", "diabetes", "heart condition", "health", "fit to dive", "safe for me", "ear pain", "surgery", "panic attacks", "flying", "fly", "decompression", "bends"])) return boundary("medical");
  if (matches(query, ["arch", "technical", "cave", "penetration", "gas mix", "gas plan", "deco", "decompression stops", "how deep", "maximum depth", "100m", "55m", "solo", "hold my breath"])) return boundary("dive-safety");
  if (matches(query, ["price", "prices", "cost", "costs", "how much", "fee", "fees", "cheap", "discount", "payment", "pay", "refund", "cancellation", "cancel", "deposit"])) return boundary("pricing");
  if (matches(query, ["book", "booking", "reserve", "reservation", "available", "availability", "tomorrow", "today", "next week", "weather", "wind", "temperature", "season", "best time", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"])) return boundary("arrangements");
  if (GREETING.test(query)) return { id: "welcome", text: profile.welcome, suggestions: profile.suggestions };
  if (matches(query, ["padi", "ssi", "cmas", "sdi", "tdi", "cdws"])) {
    const organisations = answerFor(profile, "organisations");
    if (organisations) return organisations;
  }
  if (previousTopic && matches(query, ["how long", "duration", "tell me more", "more about that", "more"])) {
    const previous = answerFor(profile, previousTopic);
    if (previous) return previous;
  }
  // Longer matched phrases win: "open water" beats "water", "explore the dive sites" beats "dive sites".
  const ranked = profile.topics
    .map((entry) => ({ entry, score: Math.max(0, ...entry.phrases.filter((phrase) => includesPhrase(query, phrase)).map((phrase) => normalize(phrase).split(" ").length * 10 + Math.min(phrase.length, 9))) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  if (!ranked.length) return generic(profile, "unknown", profile.fallback);
  const first = ranked[0];
  if (ranked[1]?.score === first.score && first.entry.id !== ranked[1].entry.id) return generic(profile, "clarify", "I found a couple of possible topics. Which would you like first?", [first.entry.phrases[0], ranked[1].entry.phrases[0]]);
  return answerFor(profile, first.entry.id) as GuideAnswer;
}

/** True when the keywords could not place the question and a reader that understands sentences should try. */
export const needsReading = (answer: GuideAnswer) => answer.id === "unknown" || answer.id === "clarify";
