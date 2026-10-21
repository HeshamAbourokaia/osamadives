import { describe, expect, it } from "vitest";
import { readResult } from "./result";

describe("readResult", () => {
  it("passes the server's own answer through", async () => {
    const res = new Response(JSON.stringify({ ok: true, id: "abc", cardUrl: "/c" }), { status: 200 });
    expect(await readResult(res)).toEqual({ ok: true, id: "abc", cardUrl: "/c" });
    const bad = new Response(JSON.stringify({ ok: false, error: "Tell Osama your name." }), { status: 400 });
    expect(await readResult(bad)).toEqual({ ok: false, error: "Tell Osama your name." });
  });

  it("explains a request the platform refused for size", async () => {
    // What Vercel sends back when the form is over 4.5 MB: plain text, not JSON.
    const res = new Response("Request Entity Too Large", { status: 413 });
    const out = await readResult(res);
    expect(out.ok).toBe(false);
    expect(out.error).toMatch(/photo/i);
  });

  it("never shows the browser's parse error for any other page", async () => {
    for (const [body, status] of [["<html>An error occurred</html>", 504], ["", 500], ["", 200]] as const) {
      const out = await readResult(new Response(body, { status }));
      expect(out.ok).toBe(false);
      expect(out.error).toBeTruthy();
      expect(out.error).not.toMatch(/pattern|JSON|token/i);
    }
  });
});
