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

/** Never throws. No key, a slow gateway or an odd reply all mean "no reading". */
export async function readQuestion(profile: GuideProfile, question: string, opts: ReadOptions = {}): Promise<Reading | null> {
  const key = opts.key ?? process.env.AI_GATEWAY_API_KEY;
  if (!key) return null;
  const criteria = criteriaFor(profile);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 5000);
  try {
    const res = await (opts.fetchImpl ?? fetch)(GATEWAY, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        state: stateFor(question),
        questions: { answer: { type: "choice", instructions: "Which reviewed answer best fits this question", criteria } },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn("[guide] reading skipped, gateway said", res.status);
      return null;
    }
    const data = (await res.json()) as { answers?: { answer?: { choice?: unknown; confidence?: unknown } } };
    const choice = data.answers?.answer?.choice;
    const confidence = data.answers?.answer?.confidence;
    if (typeof choice !== "string" || !(choice in criteria) || typeof confidence !== "number") return null;
    return { id: choice, confidence: Math.min(1, Math.max(0, confidence)) };
  } catch (e) {
    console.warn("[guide] reading skipped", e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** The id worth answering with, or null when Jev was unsure or picked "none". */
export function usableReading(reading: Reading | null): string | null {
  if (!reading || reading.id === NONE || reading.confidence < MIN_CONFIDENCE) return null;
  return reading.id;
}
