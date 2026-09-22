import { describe, expect, it } from "vitest";
import { GATEWAY, QUESTIONS, readCarefully, stateOf, triageEntry, triageLine, type Triage } from "./triage";

const input = {
  name: "Ana", country: "Spain", note: "Osama was patient with my claustrophobia. I felt safe the whole time.",
  sites: ["The Canyon"], courses: ["Open Water"], divedOn: "2026-05",
};

function gateway(answers: Record<string, unknown>, status = 200): typeof fetch {
  return (async () => ({ ok: status === 200, status, json: async () => ({ model: "jev-1.13.0", answers }) })) as unknown as typeof fetch;
}

const warm = {
  genuine: { probability: 0.97 }, spam: { probability: 0.01 }, safety: { probability: 0.03 },
  tone: { choice: "warm", confidence: 0.91 }, language: { choice: "English", confidence: 0.99 },
};

describe("triageEntry", () => {
  it("does nothing without a key and never calls the gateway", async () => {
    let called = false;
    const spy = (async () => { called = true; return { ok: true, status: 200, json: async () => ({}) }; }) as unknown as typeof fetch;
    expect(await triageEntry(input, { key: "", fetchImpl: spy })).toBeNull();
    expect(called).toBe(false);
  });
  it("turns the gateway's answers into a triage", async () => {
    const t = await triageEntry(input, { key: "k", fetchImpl: gateway(warm), now: () => "2026-09-22T12:00:00.000Z" });
    expect(t).toEqual({
      model: "jev-1.13.0", at: "2026-09-22T12:00:00.000Z",
      genuine: 0.97, spam: 0.01, safety: 0.03, tone: "warm", toneConfidence: 0.91, language: "English", languageConfidence: 0.99,
    });
  });
  it("sends every question about the student's page", async () => {
    let sent: { model: string; state: string; questions: unknown } | null = null;
    const capture = (async (_url: string, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return { ok: true, status: 200, json: async () => ({ answers: warm }) };
    }) as unknown as typeof fetch;
    await triageEntry(input, { key: "k", fetchImpl: capture });
    expect(sent!.model).toBe("typesafe-ai/jev");
    expect(sent!.questions).toEqual(QUESTIONS);
    expect(sent!.state).toBe(stateOf(input));
    expect(sent!.state).toContain("Their note:\nOsama was patient");
    expect(sent!.state).toContain("Dive sites: The Canyon");
    expect(GATEWAY).toMatch(/^https:\/\/ai-gateway\.vercel\.sh\//);
  });
  it("gives up quietly when the gateway fails, answers badly, or is slow", async () => {
    expect(await triageEntry(input, { key: "k", fetchImpl: gateway({}, 429) })).toBeNull();
    expect(await triageEntry(input, { key: "k", fetchImpl: gateway({ genuine: { probability: 1 } }) })).toBeNull();
    const boom = (async () => { throw new Error("network down"); }) as unknown as typeof fetch;
    expect(await triageEntry(input, { key: "k", fetchImpl: boom })).toBeNull();
    const slow = ((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => reject(new Error("aborted")));
    })) as unknown as typeof fetch;
    const started = Date.now();
    expect(await triageEntry(input, { key: "k", fetchImpl: slow, timeoutMs: 40 })).toBeNull();
    expect(Date.now() - started).toBeLessThan(2000);
  });
});

const base: Triage = {
  model: "jev", at: "", genuine: 0.95, spam: 0.02, safety: 0.02, tone: "warm", toneConfidence: 0.9, language: "English", languageConfidence: 0.95,
};

describe("triageLine and readCarefully", () => {
  it("says a warm English page is fine", () => {
    expect(readCarefully(base)).toBe(false);
    expect(triageLine(base)).toBe("Reads as a real student, warm in English. Nothing to worry about.");
  });
  it("asks for an Arabic reply", () => {
    const t = { ...base, language: "Arabic" as const };
    expect(triageLine(t)).toBe("Reads as a real student, warm in Arabic. Nothing to worry about. Reply in Arabic.");
  });
  it("flags a safety mention and an unhappy tone", () => {
    const t: Triage = { ...base, safety: 0.72, tone: "unhappy", toneConfidence: 0.81 };
    expect(readCarefully(t)).toBe(true);
    expect(triageLine(t)).toBe("Read carefully: mentions something going wrong in the water (72%), sounds unhappy (81%). Tone unhappy in English.");
  });
  it("flags spam and a doubtful student", () => {
    const t: Triage = { ...base, genuine: 0.12, spam: 0.9, tone: "mixed", toneConfidence: 0.4, language: "Other" };
    expect(readCarefully(t)).toBe(true);
    expect(triageLine(t)).toBe("Read carefully: looks like spam (90%), may not be a student (12% genuine). Tone mixed feelings.");
  });
  it("does not worry about an unsure unhappy reading", () => {
    const t: Triage = { ...base, tone: "unhappy", toneConfidence: 0.3 };
    expect(readCarefully(t)).toBe(false);
  });
});
