import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const post = (body: unknown, ip = "198.51.100.7") =>
  POST(new Request("http://localhost/api/guide/finder", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: typeof body === "string" ? body : JSON.stringify(body) }));

const gateway = (answers: Record<string, { choice: string; confidence: number }>) =>
  vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ answers }) }));

describe("POST /api/guide/finder", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it("rejects bodies it cannot use", async () => {
    expect((await post("nope")).status).toBe(400);
    expect((await post({})).status).toBe(400);
    expect((await post({ text: "x".repeat(601) })).status).toBe(400);
  });
  it("gives nothing back without a key", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    const spy = vi.fn();
    vi.stubGlobal("fetch", spy);
    const res = await post({ text: "never dived, one day" }, "198.51.100.8");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({});
    expect(spy).not.toHaveBeenCalled();
  });
  it("turns a sentence into the taps, keeping only the confident ones", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "k");
    vi.stubGlobal("fetch", gateway({ dived: { choice: "few", confidence: 0.9 }, card: { choice: "none", confidence: 0.8 }, want: { choice: "cert", confidence: 0.3 }, days: { choice: "3", confidence: 0.95 } }));
    expect(await (await post({ text: "five dives in Thailand years ago, no card, four days here" }, "198.51.100.9")).json()).toEqual({ dived: "few", days: "3" });
    vi.stubGlobal("fetch", gateway({ dived: { choice: "card", confidence: 0.97 }, card: { choice: "aow", confidence: 0.9 }, want: { choice: "try", confidence: 0.9 }, days: { choice: "unclear", confidence: 0.9 } }));
    expect(await (await post({ text: "advanced diver, keen for the canyon" }, "198.51.100.10")).json()).toEqual({ dived: "card", card: "aow" });
  });
});
