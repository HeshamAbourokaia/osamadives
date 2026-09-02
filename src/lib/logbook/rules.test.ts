import { describe, expect, it } from "vitest";
import { assessEntry } from "./rules";

const base = { name: "Ana", country: "Spain", note: "" };

describe("assessEntry", () => {
  it("passes an ordinary thank-you with no flags", () => {
    const a = assessEntry({ ...base, note: "Osama was patient with my claustrophobia. I felt safe the whole time. Thank you." });
    expect(a.flags).toEqual([]);
    expect(a.priority).toBe("normal");
  });
  it("flags shouting and repeated characters", () => {
    expect(assessEntry({ ...base, note: "THIS WAS THE BEST DAY OF MY WHOLE LIFE THANK YOU SO MUCH" }).flags).toContain("shouting");
    expect(assessEntry({ ...base, note: "Amazing!!!!!!!!! Loved it, would go again with him." }).flags).toContain("repeated-characters");
  });
  it("flags watch words whole-word only and raises priority", () => {
    const a = assessEntry({ ...base, note: "He is a thief and a liar, this whole thing is a scam." });
    expect(a.flags.find((f) => f.startsWith("watch-words"))).toBe("watch-words:scam,thief,liar");
    expect(a.priority).toBe("read-carefully");
    expect(assessEntry({ ...base, note: "The reef was a scampi paradise, unbelievable colours everywhere." }).flags).toEqual([]);
  });
  it("flags Arabic watch words", () => {
    expect(assessEntry({ ...base, note: "هذا الرجل نصاب ولا انصح به لأي شخص يريد الغوص هنا" }).priority).toBe("read-carefully");
  });
});
