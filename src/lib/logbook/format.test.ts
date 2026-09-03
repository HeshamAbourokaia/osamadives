import { describe, expect, it } from "vitest";
import { MONTHS, entryNumber, formatDivedOn } from "./format";

describe("format", () => {
  it("names months and pads entry numbers", () => {
    expect(MONTHS).toHaveLength(12);
    expect(formatDivedOn("2026-04")).toBe("April 2026");
    expect(formatDivedOn("2026-04-12")).toBe("12 April 2026");
    expect(formatDivedOn("")).toBe("");
    expect(formatDivedOn("2026-13")).toBe("");
    expect(entryNumber(7)).toBe("007");
  });
});
