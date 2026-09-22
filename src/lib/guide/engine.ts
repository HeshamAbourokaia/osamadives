import { MEDICAL_SOURCE } from "./profile";
import type { GuideAnswer, GuideProfile } from "./types";

export const MAX_GUIDE_LENGTH = 600;

const APOSTROPHES = /[’']/g;
const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(APOSTROPHES, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
const includesPhrase = (query: string, phrase: string) => ` ${query} `.includes(` ${normalize(phrase)} `);
const matches = (query: string, phrases: string[]) => phrases.some((phrase) => includesPhrase(query, phrase));
const GREETING = /^(hi|hello|hey|good morning|good evening|thanks|thank you|شكرا|مرحبا|اهلا)$/;

/**
 * Deterministic answers from a reviewed list. Nothing here calls a model, the
 * network or storage, and nothing it says can book, price or approve anything.
 * The order matters: safety and boundary replies win before any topic is matched.
 */
export function answerQuestion(profile: GuideProfile, input: unknown, previousTopic?: string): GuideAnswer {
  const query = normalize(typeof input === "string" ? input.slice(0, MAX_GUIDE_LENGTH) : "");
  const generic = (id: string, text: string, suggestions = profile.suggestions): GuideAnswer => ({ id, text, actions: [profile.contact], suggestions });

  if (!query) return generic("empty", "Choose a question below, or type what you would like to know.");
  if (matches(query, ["who are you", "are you osama", "are you human", "are you a person", "are you ai", "are you a bot", "are you real"])) return { id: "identity", text: profile.welcome, suggestions: profile.suggestions };
  if (matches(query, ["ignore instructions", "ignore previous", "system prompt", "api key", "password", "passport", "bank", "home address", "admin", "customer data", "booking records", "private"])) return generic("privacy", "I only answer visitor questions from what the site already says. I cannot reach private records, passwords or anything behind the scenes.");
  if (matches(query, ["emergency", "cant breathe", "cannot breathe", "chest pain", "unconscious", "drowning", "not breathing"])) return generic("emergency", "If this is an emergency, contact local emergency services right now and get help from someone nearby. Do not wait for this guide or a WhatsApp reply. I cannot assess or manage an emergency.", []);
  if (matches(query, ["medical", "asthma", "pregnant", "pregnancy", "medication", "diabetes", "heart condition", "health", "fit to dive", "safe for me", "ear pain", "surgery", "panic attacks", "flying", "fly", "decompression", "bends"])) {
    return { ...generic("medical", "I cannot assess fitness to dive, symptoms, medication or how soon you can fly after diving. Talk to a dive-medicine doctor and complete the centre's official screening form. Please do not put medical details in this chat.", []), sources: [MEDICAL_SOURCE] };
  }
  if (matches(query, ["arch", "technical", "cave", "penetration", "gas mix", "gas plan", "deco", "decompression stops", "how deep", "maximum depth", "100m", "55m", "solo", "hold my breath"])) {
    return generic("dive-safety", "This guide gives visitor information, not dive plans or underwater instruction. The Blue Hole Arch and any overhead or technical diving need the right specialist training. Osama and the organising centre assess what you can do against your qualifications and the conditions; I cannot confirm that you are eligible.", ["Explore the dive sites", "Which organisations?"]);
  }
  if (matches(query, ["price", "prices", "cost", "costs", "how much", "fee", "fees", "cheap", "discount", "payment", "pay", "refund", "cancellation", "cancel", "deposit"])) {
    const topic = profile.topics.find((entry) => entry.id === previousTopic);
    return generic("pricing", `I do not have prices, inclusions or cancellation terms${topic ? " for that" : ""}. Osama does not sell courses himself; the CDWS registered centre that organises your activity sets those. Message him and he will point you to the right centre. No payment or booking happens here.`);
  }
  if (matches(query, ["book", "booking", "reserve", "reservation", "available", "availability", "tomorrow", "today", "next week", "weather", "wind", "temperature", "season", "best time", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"])) {
    return generic("arrangements", "I do not have Osama's calendar, the forecast or confirmed trip dates. Message him with your dates and experience. The CDWS registered centre confirms the arrangements and whether the plan suits you; nothing is reserved here.", ["What should I bring?", "Which organisations?"]);
  }
  if (GREETING.test(query)) return { id: "welcome", text: profile.welcome, suggestions: profile.suggestions };
  if (matches(query, ["padi", "ssi", "cmas", "sdi", "tdi", "cdws"])) {
    const organisations = profile.topics.find((entry) => entry.id === "organisations");
    if (organisations) return { ...organisations, actions: [profile.contact] };
  }
  if (previousTopic && matches(query, ["how long", "duration", "tell me more", "more about that", "more"])) {
    const previous = profile.topics.find((entry) => entry.id === previousTopic);
    if (previous) return { ...previous, actions: [profile.contact] };
  }
  // Longer matched phrases win: "open water" beats "water", "explore the dive sites" beats "dive sites".
  const ranked = profile.topics
    .map((entry) => ({ entry, score: Math.max(0, ...entry.phrases.filter((phrase) => includesPhrase(query, phrase)).map((phrase) => normalize(phrase).split(" ").length * 10 + Math.min(phrase.length, 9))) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  if (!ranked.length) return generic("unknown", profile.fallback);
  const first = ranked[0];
  if (ranked[1]?.score === first.score && first.entry.id !== ranked[1].entry.id) return generic("clarify", "I found a couple of possible topics. Which would you like first?", [first.entry.phrases[0], ranked[1].entry.phrases[0]]);
  const { id, text, sources, suggestions } = first.entry;
  return { id, text, sources, actions: [profile.contact], suggestions: suggestions ?? profile.suggestions };
}
