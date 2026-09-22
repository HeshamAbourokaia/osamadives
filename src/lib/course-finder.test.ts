import { describe, expect, it } from "vitest";
import { courseAnswer } from "./course-finder";
import { levelSays, siteFit } from "./level";

describe("experience carried from the course finder into enquiries", () => {
  it.each(["try", "cert"] as const)("keeps previous uncertified dives for %s", (want) => {
    const result = courseAnswer("few", want, null, "3");
    expect(result.ask).toContain("tried diving once or twice");
    expect(result.ask).not.toContain("never dived");
    expect(levelSays(result.level)).toContain("tried diving once or twice");
    expect(siteFit("Open Water+", result.level).tone).toBe("next");
    expect(siteFit("Advanced+", result.level).tone).toBe("next");
  });
  it("keeps actual first-timers distinct", () => {
    const result = courseAnswer("never", "try", null, "1");
    expect(result.ask).toContain("never dived");
    expect(levelSays(result.level)).toBe("I have never dived");
  });
  it("does not turn a certified diver into an uncertified visitor", () => {
    const result = courseAnswer("card", null, "ow", "1");
    expect(result.ask).toContain("Open Water certified");
    expect(levelSays(result.level)).toBe("I am Open Water certified");
  });
});
