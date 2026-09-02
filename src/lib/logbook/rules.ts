// Content rules: what gets FLAGGED for the moderator's attention.
//
// Nothing here publishes or blocks. Every entry waits for Osama or Hesham to
// tap Approve. These flags ride along in the notification so a note that
// deserves a careful read is marked before anyone opens it.
//
// Shape it to your students. Osama teaches in English and Arabic with a little
// German and Russian, so word lists in those languages belong here too.

export interface Assessment {
  flags: string[];
  priority: "normal" | "read-carefully";
}

export interface AssessInput {
  name: string;
  country: string;
  note: string;
}

// Words that often show up in a vindictive note rather than a thank-you.
// Matching is whole-word and case-insensitive. Add Arabic words as plain text.
const WATCH_WORDS = [
  "scam", "fraud", "thief", "liar", "cheat", "stole", "dangerous", "unsafe",
  "idiot", "stupid", "worst", "rip-off", "ripoff", "refund", "lawyer", "police",
  "نصاب", "حرامي", "كذاب",
];

export function assessEntry(input: AssessInput): Assessment {
  const flags: string[] = [];
  const note = input.note;
  const letters = note.replace(/[^\p{L}]/gu, "");
  const upper = letters.replace(/[^\p{Lu}]/gu, "");

  if (letters.length >= 20 && upper.length / letters.length > 0.6) flags.push("shouting");
  if (/(.)\1{5,}/u.test(note)) flags.push("repeated-characters");
  if (note.length < 40) flags.push("very-short");
  if (input.name.length > 0 && /^[^\p{L}]+$/u.test(input.name)) flags.push("name-has-no-letters");

  const lower = note.toLowerCase();
  const hits = WATCH_WORDS.filter((w) =>
    new RegExp(`(^|[^\\p{L}])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "iu").test(lower),
  );
  if (hits.length) flags.push(`watch-words:${hits.join(",")}`);

  const priority = flags.some((f) => f.startsWith("watch-words") || f === "shouting")
    ? "read-carefully"
    : "normal";

  return { flags, priority };
}
