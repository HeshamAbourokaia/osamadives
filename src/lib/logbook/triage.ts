// A second reader for every new review: Jev, TypeSafe AI's decision model, called
// through Vercel's AI Gateway. It writes nothing. It reads the page a student just
// signed and answers five fixed questions with a probability, so the phone
// notification and the moderation page can say, before anyone opens the note,
// whether it reads as a real student, how it sounds, what language it is in, and
// whether it mentions something going wrong in the water.
//
// Nothing here publishes or hides. Every page still waits for Osama or Hesham to
// tap Approve. When the key is missing, the gateway is slow, or anything fails,
// the entry simply carries no triage and moderation carries on as before.

export interface TriageInput {
  name: string;
  country: string;
  note: string;
  sites: string[];
  courses: string[];
  divedOn: string;
}

export type Tone = "warm" | "mixed" | "unhappy";
export type Language = "English" | "Arabic" | "German" | "Russian" | "Other";

export interface Triage {
  model: string;
  at: string;
  /** How likely the note is a real student writing about diving with Osama. */
  genuine: number;
  /** How likely it is spam, an advert, or nothing to do with a dive. */
  spam: number;
  /** How likely it describes an accident, injury or unsafe moment. */
  safety: number;
  tone: Tone;
  toneConfidence: number;
  language: Language;
  languageConfidence: number;
}

export const MODEL = "typesafe-ai/jev";
export const GATEWAY = "https://ai-gateway.vercel.sh/v1/evaluate";

export const QUESTIONS = {
  genuine: {
    type: "boolean",
    instructions: "The note reads as a real student or diver writing about a dive or course they did with Osama",
  },
  spam: {
    type: "boolean",
    instructions: "The note is spam, an advertisement, a link drop, or has nothing to do with diving with Osama",
  },
  safety: {
    type: "boolean",
    instructions: "The note describes an accident, an injury, equipment failing, or a moment the writer felt unsafe in the water",
  },
  tone: {
    type: "choice",
    instructions: "How the writer feels about their time with Osama",
    criteria: {
      warm: "Happy, grateful, or recommending him",
      mixed: "Some praise and some complaint, or no clear feeling",
      unhappy: "Disappointed, angry, or warning others",
    },
  },
  language: {
    type: "choice",
    instructions: "The language most of the note is written in",
    criteria: {
      English: "English",
      Arabic: "Arabic",
      German: "German",
      Russian: "Russian",
      Other: "Any other language, or too short to tell",
    },
  },
} as const;

export function stateOf(i: TriageInput): string {
  const lines = [
    "Osama is a PADI diving instructor in Dahab, Egypt. After diving with him, students",
    "write him a page in his online logbook. This is one new page, not yet published.",
    "",
    `Name: ${i.name}`,
    i.country ? `Country: ${i.country}` : "",
    i.sites.length ? `Dive sites: ${i.sites.join(", ")}` : "",
    i.courses.length ? `Courses: ${i.courses.join(", ")}` : "",
    i.divedOn ? `Dived on: ${i.divedOn}` : "",
    "",
    "Their note:",
    i.note,
  ];
  return lines.filter((l) => l !== "").join("\n");
}

type Answers = {
  genuine: { probability: number };
  spam: { probability: number };
  safety: { probability: number };
  tone: { choice: Tone; confidence?: number };
  language: { choice: Language; confidence?: number };
};

export interface TriageOptions {
  key?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  now?: () => string;
}

// Never throws. A missing key, a slow gateway or a malformed answer all mean "no triage".
export async function triageEntry(input: TriageInput, opts: TriageOptions = {}): Promise<Triage | null> {
  const key = opts.key ?? process.env.AI_GATEWAY_API_KEY;
  if (!key) return null;
  const doFetch = opts.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 5000);
  try {
    const res = await doFetch(GATEWAY, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, state: stateOf(input), questions: QUESTIONS }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn("[logbook] triage skipped, gateway said", res.status);
      return null;
    }
    const data = (await res.json()) as { model?: string; answers?: Partial<Answers> };
    const a = data.answers;
    if (!a || !a.genuine || !a.spam || !a.safety || !a.tone || !a.language) return null;
    const p = (n: unknown) => (typeof n === "number" && Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);
    return {
      model: data.model || MODEL,
      at: opts.now ? opts.now() : new Date().toISOString(),
      genuine: p(a.genuine.probability),
      spam: p(a.spam.probability),
      safety: p(a.safety.probability),
      tone: a.tone.choice,
      toneConfidence: p(a.tone.confidence),
      language: a.language.choice,
      languageConfidence: p(a.language.confidence),
    };
  } catch (e) {
    console.warn("[logbook] triage skipped", e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** True when the note deserves a careful read before it goes anywhere. */
export function readCarefully(t: Triage): boolean {
  return t.safety >= 0.5 || t.spam >= 0.5 || t.genuine < 0.4 || (t.tone === "unhappy" && t.toneConfidence >= 0.5);
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

/** One plain sentence for the phone and the moderation page. */
export function triageLine(t: Triage): string {
  const worries: string[] = [];
  if (t.safety >= 0.5) worries.push(`mentions something going wrong in the water (${pct(t.safety)})`);
  if (t.spam >= 0.5) worries.push(`looks like spam (${pct(t.spam)})`);
  if (t.genuine < 0.4) worries.push(`may not be a student (${pct(t.genuine)} genuine)`);
  if (t.tone === "unhappy" && t.toneConfidence >= 0.5) worries.push(`sounds unhappy (${pct(t.toneConfidence)})`);

  const tone = t.tone === "warm" ? "warm" : t.tone === "mixed" ? "mixed feelings" : "unhappy";
  const lang = t.language === "Other" ? "" : ` in ${t.language}`;
  if (worries.length) return `Read carefully: ${worries.join(", ")}. Tone ${tone}${lang}.`;
  const reply = t.language === "Arabic" ? " Reply in Arabic." : t.language === "German" || t.language === "Russian" ? ` They wrote in ${t.language}.` : "";
  return `Reads as a real student, ${tone}${lang}. Nothing to worry about.${reply}`;
}
