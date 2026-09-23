import { describe, expect, it } from "vitest";
import { enquiryMessage, mentionsHealth, NOTE_TEXT } from "./enquiry";

const ASK = "I have never dived and would love to try.";

describe("enquiryMessage", () => {
  it("is the plain greeting when nothing was typed", () => {
    expect(enquiryMessage(ASK, "")).toBe(`Hi Osama! I found you on osamadives.com. ${ASK}`);
  });
  it("carries the visitor's own sentence, tidied", () => {
    expect(enquiryMessage(ASK, "  two of us,\n mid October,  four days ")).toBe(`Hi Osama! I found you on osamadives.com. ${ASK}\n\nIn my own words: "two of us, mid October, four days"`);
  });
  it("adds one line for each thing Osama should ask about", () => {
    const text = enquiryMessage(ASK, "my wife is scared of water and our son is 11", ["nerves", "children"]);
    expect(text).toContain('In my own words: "my wife is scared of water and our son is 11"');
    expect(text).toMatch(/nerves in the water\. I would like to ask about diving with children\.$/);
  });
  it("never repeats health details: Jev's flag or the keyword backstop keeps the sentence out", () => {
    const flagged = enquiryMessage(ASK, "I had knee surgery in May, is that ok?", ["medical"]);
    expect(flagged).not.toContain("knee");
    expect(flagged).toContain("health question");
    const missed = enquiryMessage(ASK, "I take medication for asthma", []);
    expect(missed).not.toContain("asthma");
    expect(missed).toBe(`Hi Osama! I found you on osamadives.com. ${ASK}`);
  });
});

describe("mentionsHealth", () => {
  it("uses the guide's medical and emergency words", () => {
    expect(mentionsHealth("I am pregnant")).toBe(true);
    expect(mentionsHealth("chest pain after diving")).toBe(true);
    expect(mentionsHealth("two of us, four days, never dived")).toBe(false);
    expect(mentionsHealth("Flying in Monday, Advanced diver, want the Canyon")).toBe(false);
  });
});

describe("NOTE_TEXT", () => {
  it("has no dashes and links only to the DAN screening page", () => {
    for (const note of Object.values(NOTE_TEXT)) {
      expect(note.text).not.toMatch(/[–—]/);
      if (note.link) expect(note.link.href).toMatch(/^https:\/\/dan\.org\//);
    }
  });
});
