import { describe, expect, it } from "vitest";
import { BOUNDARIES, answerFor } from "./engine";
import { GATEWAY, MIN_CONFIDENCE, NONE, criteriaFor, readQuestion, stateFor, usableReading } from "./jev";
import { guideProfile } from "./profile";

function gateway(choice: string, confidence: number, status = 200): typeof fetch {
  return (async () => ({ ok: status === 200, status, json: async () => ({ answers: { answer: { type: "choice", choice, confidence } } }) })) as unknown as typeof fetch;
}

describe("criteriaFor", () => {
  it("offers every topic, every boundary and a way out", () => {
    const c = criteriaFor(guideProfile);
    for (const t of guideProfile.topics) expect(c[t.id], t.id).toBeTruthy();
    for (const b of Object.keys(BOUNDARIES)) expect(c[b], b).toBe(BOUNDARIES[b].description);
    expect(c[NONE]).toMatch(/None of these/);
  });
  it("every id it can return has words to answer with", () => {
    for (const id of Object.keys(criteriaFor(guideProfile))) {
      if (id === NONE) continue;
      expect(answerFor(guideProfile, id), id).not.toBeNull();
    }
  });
});

describe("readQuestion", () => {
  const q = "My wife is scared of the water, could she still try it?";
  it("does nothing without a key", async () => {
    let called = false;
    const spy = (async () => { called = true; return { ok: true, status: 200, json: async () => ({}) }; }) as unknown as typeof fetch;
    expect(await readQuestion(guideProfile, q, { key: "", fetchImpl: spy })).toBeNull();
    expect(called).toBe(false);
  });
  it("sends the question with the reviewed list and returns Jev's pick", async () => {
    let sent: { model: string; state: string; questions: { answer: { criteria: Record<string, string> } } } | null = null;
    const capture = (async (_url: string, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return { ok: true, status: 200, json: async () => ({ answers: { answer: { choice: "intro", confidence: 0.83 } } }) };
    }) as unknown as typeof fetch;
    expect(await readQuestion(guideProfile, q, { key: "k", fetchImpl: capture })).toEqual({ id: "intro", confidence: 0.83 });
    expect(sent!.model).toBe("typesafe-ai/jev");
    expect(sent!.state).toBe(stateFor(q));
    expect(sent!.state).toContain(q);
    expect(Object.keys(sent!.questions.answer.criteria)).toEqual(Object.keys(criteriaFor(guideProfile)));
    expect(GATEWAY).toMatch(/^https:\/\/ai-gateway\.vercel\.sh\//);
  });
  it("refuses an id that is not on the list, and gives up quietly on failure", async () => {
    expect(await readQuestion(guideProfile, q, { key: "k", fetchImpl: gateway("made-up", 0.9) })).toBeNull();
    expect(await readQuestion(guideProfile, q, { key: "k", fetchImpl: gateway("intro", 0.9, 429) })).toBeNull();
    const boom = (async () => { throw new Error("down"); }) as unknown as typeof fetch;
    expect(await readQuestion(guideProfile, q, { key: "k", fetchImpl: boom })).toBeNull();
    const slow = ((_url: string, init: RequestInit) => new Promise((_r, reject) => init.signal?.addEventListener("abort", () => reject(new Error("aborted"))))) as unknown as typeof fetch;
    expect(await readQuestion(guideProfile, q, { key: "k", fetchImpl: slow, timeoutMs: 40 })).toBeNull();
  });
});

describe("usableReading", () => {
  it("only trusts a confident pick that is not 'none'", () => {
    expect(usableReading(null)).toBeNull();
    expect(usableReading({ id: NONE, confidence: 0.99 })).toBeNull();
    expect(usableReading({ id: "intro", confidence: MIN_CONFIDENCE - 0.01 })).toBeNull();
    expect(usableReading({ id: "intro", confidence: MIN_CONFIDENCE })).toBe("intro");
    expect(usableReading({ id: "pricing", confidence: 0.7 })).toBe("pricing");
  });
});
