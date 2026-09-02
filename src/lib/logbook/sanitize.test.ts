import { describe, expect, it } from "vitest";
import { cleanText, findForbidden } from "./sanitize";

describe("cleanText", () => {
  it("trims, collapses whitespace and caps length", () => {
    expect(cleanText("  Ana   Shinobi \n", 40)).toBe("Ana Shinobi");
    expect(cleanText("x".repeat(50), 40)).toHaveLength(40);
    expect(cleanText(123, 40)).toBe("");
  });
  it("keeps paragraph breaks in notes but not runs of blank lines", () => {
    expect(cleanText("one\r\n\r\n\r\n\r\ntwo\t three", 600, true)).toBe("one\n\ntwo three");
  });
  it("strips control characters", () => {
    const dirty = "hi" + String.fromCharCode(1) + "there" + String.fromCharCode(127);
    expect(cleanText(dirty, 40)).toBe("hithere");
  });
});

describe("findForbidden", () => {
  it("catches links in every common shape", () => {
    expect(findForbidden("see https://example.com now")).toBe("link");
    expect(findForbidden("see www.example.com now")).toBe("link");
    expect(findForbidden("visit mysite.ru please")).toBe("link");
  });
  it("catches emails and phone numbers", () => {
    expect(findForbidden("mail me at a@b.co")).toBe("email");
    expect(findForbidden("call +20 109 020 8050")).toBe("phone");
    expect(findForbidden("call 0412 345 678")).toBe("phone");
  });
  it("lets dates, depths and ordinary notes through", () => {
    expect(findForbidden("Dived the Blue Hole on 2026-05-12, 30 m, 45 min.")).toBeNull();
    expect(findForbidden("Osama was calm and patient. I felt safe at 18m.")).toBeNull();
    expect(findForbidden("Best day. Thank you!")).toBeNull();
  });
});
