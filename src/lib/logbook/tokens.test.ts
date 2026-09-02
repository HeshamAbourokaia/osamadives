import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "./tokens";

const S = "unit-test-secret-1234567890";

describe("moderation tokens", () => {
  it("round-trips for the same purpose and id", () => {
    const t = signToken("moderate", "abc123", 60, S, 1_000_000_000_000);
    expect(verifyToken("moderate", "abc123", t, S, 1_000_000_000_000)).toBe(true);
  });
  it("rejects a different id, purpose or secret", () => {
    const t = signToken("moderate", "abc123", 60, S);
    expect(verifyToken("moderate", "abc124", t, S)).toBe(false);
    expect(verifyToken("share", "abc123", t, S)).toBe(false);
    expect(verifyToken("moderate", "abc123", t, "other-secret-xxxxxxxxxxxx")).toBe(false);
  });
  it("expires", () => {
    const now = 1_000_000_000_000;
    const t = signToken("share", "id", 10, S, now);
    expect(verifyToken("share", "id", t, S, now + 9_000)).toBe(true);
    expect(verifyToken("share", "id", t, S, now + 11_000)).toBe(false);
  });
  it("rejects garbage without throwing", () => {
    expect(verifyToken("moderate", "id", "nope", S)).toBe(false);
    expect(verifyToken("moderate", "id", 42, S)).toBe(false);
    expect(verifyToken("moderate", "id", "123-zz", S)).toBe(false);
  });
});
