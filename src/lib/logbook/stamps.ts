import type { StampKey } from "./types";

export interface StampInfo {
  key: StampKey;
  label: string;
  ring: string;
  line: string;
}

// The ring text runs around the stamp. The line is how it reads in a sentence.
export const STAMPS: StampInfo[] = [
  { key: "first-breath", label: "First breath", ring: "FIRST BREATH UNDERWATER · DAHAB", line: "took a first breath underwater" },
  { key: "dsd", label: "DSD", ring: "DISCOVER SCUBA DIVING · DAHAB", line: "tried Discover Scuba Diving" },
  { key: "introduction", label: "Intro dive", ring: "INTRO DIVE · FIRST TIME IN THE SEA", line: "went on an intro dive" },
  { key: "open-water", label: "Open Water", ring: "OPEN WATER DIVER · 18 M · DAHAB", line: "became an Open Water diver" },
  { key: "advanced", label: "Advanced", ring: "ADVANCED · 30 M · DAHAB", line: "went to thirty metres" },
  { key: "rescue", label: "Rescue", ring: "RESCUE DIVER · A BUDDY WORTH HAVING", line: "became a buddy worth diving with" },
  { key: "blue-hole", label: "Blue Hole", ring: "BLUE HOLE · THE ICON · DAHAB", line: "dived the Blue Hole" },
  { key: "canyon", label: "The Canyon", ring: "THE CANYON · SHAFTS OF SUN", line: "dived the Canyon" },
  { key: "night", label: "Night dive", ring: "NIGHT DIVE · TORCHES ON · DAHAB", line: "dived at night" },
  { key: "family-shore", label: "Guest of the family", ring: "GUEST OF THE FAMILY · SINCE 1983", line: "was a guest of the family" },
];

export function stampInfo(key: StampKey): StampInfo {
  return STAMPS.find((s) => s.key === key) ?? STAMPS[0];
}
