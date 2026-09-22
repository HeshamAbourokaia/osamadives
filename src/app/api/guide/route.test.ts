import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const post = (body: unknown, ip = "203.0.113.7") =>
  POST(new Request("http://localhost/api/guide", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: typeof body === "string" ? body : JSON.stringify(body) }));

describe("POST /api/guide", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it("rejects bodies it cannot use", async () => {
    expect((await post("not json")).status).toBe(400);
    expect((await post({})).status).toBe(400);
    expect((await post({ question: "" })).status).toBe(400);
    expect((await post({ question: "x".repeat(601) })).status).toBe(400);
  });
  it("answers null without a key and never calls out", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    const spy = vi.fn();
    vi.stubGlobal("fetch", spy);
    const res = await post({ question: "can my wife come along if she does not dive" }, "203.0.113.8");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: null, confidence: null });
    expect(spy).not.toHaveBeenCalled();
  });
  it("returns Jev's pick with the key set, and only an id from the list", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ answers: { answer: { choice: "trips", confidence: 0.77 } } }) })));
    const res = await post({ question: "is there a day out on camels" }, "203.0.113.9");
    expect(await res.json()).toEqual({ id: "trips", confidence: 0.77 });
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ answers: { answer: { choice: "none", confidence: 0.9 } } }) })));
    expect(await (await post({ question: "best pizza in dahab" }, "203.0.113.10")).json()).toEqual({ id: null, confidence: 0.9 });
  });
  it("slows a script down", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    let last = 200;
    for (let i = 0; i < 25; i++) last = (await post({ question: `question ${i}` }, "203.0.113.99")).status;
    expect(last).toBe(429);
  });
});
