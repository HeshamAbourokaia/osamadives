import { BOUNDARIES } from "./engine";
import type { GuideProfile } from "./types";

// When the keywords cannot place a question, Jev reads it and picks which reviewed
// answer fits, or says that none does. It only ever chooses from the list below; it
// never writes an answer of its own, so the guide can still say nothing the site
// does not say. Runs on the server: the gateway key never reaches a browser.

export const MODEL = "typesafe-ai/jev";
export const GATEWAY = "https://ai-gateway.vercel.sh/v1/evaluate";
export const NONE = "none";
/** Below this, Jev's pick is treated as a miss and the visitor gets the honest fallback. */
export const MIN_CONFIDENCE = 0.45;

export type Reading = { id: string; confidence: number };
type Choice = { choice?: unknown; confidence?: unknown; probability?: unknown };

export function criteriaFor(profile: GuideProfile): Record<string, string> {
  const criteria: Record<string, string> = {};
  for (const topic of profile.topics) {
    const label = topic.sources?.[0]?.label ?? topic.id;
    criteria[topic.id] = `${label}: ${topic.text.split(". ")[0]}`;
  }
  for (const [id, boundary] of Object.entries(BOUNDARIES)) criteria[id] = boundary.description;
  criteria[NONE] = "None of these: not about diving with Osama in Dahab, or nothing on this list answers it";
  return criteria;
}

export function stateFor(question: string): string {
  return `A visitor to Osama's diving website in Dahab, Egypt typed this question into the site's guide. Osama is a PADI instructor who works through CDWS registered dive centres.\n\nQuestion:\n${question}`;
}

export interface ReadOptions {
  key?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

/** One call to Jev. Never throws: no key, a slow gateway or a bad reply all come back as null. */
async function evaluate(state: string, questions: Record<string, unknown>, opts: ReadOptions): Promise<Record<string, Choice> | null> {
  const key = opts.key ?? process.env.AI_GATEWAY_API_KEY;
  if (!key) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 5000);
  try {
    const res = await (opts.fetchImpl ?? fetch)(GATEWAY, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, state, questions }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn("[guide] reading skipped, gateway said", res.status);
      return null;
    }
    const data = (await res.json()) as { answers?: Record<string, Choice> };
    return data.answers && typeof data.answers === "object" ? data.answers : null;
  } catch (e) {
    console.warn("[guide] reading skipped", e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const pick = (a: Choice | undefined, allowed: string[]): Reading | null =>
  a && typeof a.choice === "string" && allowed.includes(a.choice) && typeof a.confidence === "number"
    ? { id: a.choice, confidence: Math.min(1, Math.max(0, a.confidence)) }
    : null;

export async function readQuestion(profile: GuideProfile, question: string, opts: ReadOptions = {}): Promise<Reading | null> {
  const criteria = criteriaFor(profile);
  const answers = await evaluate(stateFor(question), { answer: { type: "choice", instructions: "Which reviewed answer best fits this question", criteria } }, opts);
  return pick(answers?.answer, Object.keys(criteria));
}

/** The id worth answering with, or null when Jev was unsure or picked "none". */
export function usableReading(reading: Reading | null): string | null {
  if (!reading || reading.id === NONE || reading.confidence < MIN_CONFIDENCE) return null;
  return reading.id;
}

// ---------------------------------------------------------------------------
// The course finder: three taps, or one sentence. Jev turns the sentence into the
// same three answers the taps would give, each with its own confidence, and only a
// confident one is filled in. The visitor still sees the taps and can change any.
// ---------------------------------------------------------------------------

export const FINDER_QUESTIONS = {
  dived: {
    type: "choice",
    instructions: "Has this person dived before",
    criteria: {
      never: "Never been diving at all",
      few: "Has tried diving once or a few times, on a trial or intro dive, but holds no certification card",
      card: "Holds a diving certification card of any level",
      unclear: "Cannot tell from what they wrote",
    },
  },
  card: {
    type: "choice",
    instructions: "If they hold a certification, which level",
    criteria: {
      ow: "Open Water, or an equivalent entry-level card from any agency",
      aow: "Advanced Open Water or equivalent",
      pro: "Rescue Diver, Divemaster, instructor, or anything above Advanced",
      none: "No card, or the level is not said",
    },
  },
  want: {
    type: "choice",
    instructions: "What they want from their time in the water",
    criteria: {
      try: "Just to try diving, a taste, no certification in mind",
      cert: "To get certified or to progress to the next card",
      unclear: "Not said",
    },
  },
  days: {
    type: "choice",
    instructions: "How many days they have for diving",
    criteria: {
      "1": "One day, or a single morning or afternoon",
      "3": "Two, three or four days",
      "7": "Five days, a week or more",
      unclear: "Not said",
    },
  },
} as const;

// The same sentence also says things Osama should know before he replies. Each is a
// yes-or-no, so one sentence can carry several. None of them decides anything: they
// only choose which of the site's own reviewed notes to show, and one plain line in
// the WhatsApp message so Osama knows what to ask about.
export const ENQUIRY_FLAGS = {
  medical: { type: "boolean", instructions: "Mentions a health condition, medication, pregnancy, a recent operation, asthma, the heart, epilepsy, diabetes, the ears or sinuses, or asks whether they are fit or allowed to dive" },
  nerves: { type: "boolean", instructions: "Someone is nervous, anxious or scared about the water or diving, or is not a confident swimmer" },
  children: { type: "boolean", instructions: "A child or teenager under 15 would dive or snorkel too" },
} as const;
export type EnquiryNote = keyof typeof ENQUIRY_FLAGS;
export const ENQUIRY_NOTES = Object.keys(ENQUIRY_FLAGS) as EnquiryNote[];
/** A health mention is flagged when Jev is only 40% sure: showing the screening note by
    mistake costs a line of reading, missing it can cost a diver. */
export const NOTE_MIN: Record<EnquiryNote, number> = { medical: 0.4, nerves: 0.5, children: 0.5 };

export type FinderReading = { dived?: "never" | "few" | "card"; card?: "ow" | "aow" | "pro"; want?: "try" | "cert"; days?: "1" | "3" | "7"; notes?: EnquiryNote[] };
export const FINDER_MIN_CONFIDENCE = 0.5;

export function finderState(text: string): string {
  return `Someone thinking about diving with Osama in Dahab, Egypt wrote this about themselves:\n\n${text}`;
}

export async function readFinder(text: string, opts: ReadOptions = {}): Promise<Record<string, Reading | null> | null> {
  const answers = await evaluate(finderState(text), { ...FINDER_QUESTIONS, ...ENQUIRY_FLAGS }, opts);
  if (!answers) return null;
  const out: Record<string, Reading | null> = {};
  for (const [name, q] of Object.entries(FINDER_QUESTIONS)) out[name] = pick(answers[name], Object.keys(q.criteria));
  // A yes-or-no comes back as a probability; kept in the same shape, with "yes" as its id.
  for (const name of ENQUIRY_NOTES) {
    const p = answers[name]?.probability;
    out[name] = typeof p === "number" && Number.isFinite(p) ? { id: "yes", confidence: Math.min(1, Math.max(0, p)) } : null;
  }
  return out;
}

/** Only the confident, meaningful answers, in the finder's own vocabulary. */
export function usableFinder(raw: Record<string, Reading | null> | null, min = FINDER_MIN_CONFIDENCE): FinderReading {
  const out: FinderReading = {};
  if (!raw) return out;
  const sure = (name: string, skip: string[]) => {
    const r = raw[name];
    return r && r.confidence >= min && !skip.includes(r.id) ? r.id : null;
  };
  const dived = sure("dived", ["unclear"]);
  if (dived) out.dived = dived as FinderReading["dived"];
  const card = sure("card", ["none"]);
  if (card && out.dived === "card") out.card = card as FinderReading["card"];
  const want = sure("want", ["unclear"]);
  if (want && out.dived !== "card") out.want = want as FinderReading["want"];
  const days = sure("days", ["unclear"]);
  if (days) out.days = days as FinderReading["days"];
  const notes = ENQUIRY_NOTES.filter((name) => (raw[name]?.confidence ?? 0) >= NOTE_MIN[name]);
  if (notes.length) out.notes = notes;
  return out;
}
