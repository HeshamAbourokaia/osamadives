import { STAMP_KEYS, type StampKey } from "./types";

export interface StampInfo {
  key: StampKey;
  label: string;
  ring: string;
  line: string;
}

// The ring text runs around the stamp. The line is how it reads in a sentence.
// Order matches the ladder: youngest and earliest first, sites and moments last.
export const STAMPS: StampInfo[] = [
  { key: "seal-team", label: "Seal Team", ring: "SEAL TEAM · YOUNG DIVER · DAHAB", line: "joined the Seal Team" },
  { key: "bubblemaker", label: "Bubblemaker", ring: "BUBBLEMAKER · FIRST BUBBLES · DAHAB", line: "blew their first bubbles" },
  { key: "introduction", label: "Intro dive", ring: "INTRO DIVE · FIRST TIME IN THE SEA", line: "went on an intro dive" },
  { key: "dsd", label: "DSD", ring: "DISCOVER SCUBA DIVING · DAHAB", line: "tried Discover Scuba Diving" },
  { key: "open-water", label: "Open Water", ring: "OPEN WATER DIVER · 18 M · DAHAB", line: "became an Open Water diver" },
  { key: "advanced", label: "Advanced", ring: "ADVANCED · 30 M · DAHAB", line: "went to thirty metres" },
  { key: "deep-specialty", label: "Deep Specialty", ring: "DEEP SPECIALTY · 40 M · DAHAB", line: "went to forty metres" },
  { key: "nitrox", label: "Nitrox", ring: "ENRICHED AIR NITROX · DAHAB", line: "dived on Nitrox" },
  { key: "rescue", label: "Rescue Diver", ring: "RESCUE DIVER · A BUDDY WORTH HAVING", line: "became a buddy worth diving with" },
  { key: "divemaster", label: "Divemaster", ring: "DIVEMASTER · PROFESSIONAL · DAHAB", line: "became a Divemaster" },
  { key: "dpv-diver", label: "DPV Diver", ring: "DPV DIVER · UNDERWATER SCOOTER · DAHAB", line: "rode the underwater scooter" },
  { key: "night-diver-specialty", label: "Night Diver Specialty", ring: "NIGHT DIVER SPECIALTY · DAHAB", line: "certified as a Night Diver" },
  { key: "peak-performance-buoyancy", label: "Perfect Buoyancy", ring: "PEAK PERFORMANCE BUOYANCY · DAHAB", line: "found perfect buoyancy in the water" },
  { key: "blue-hole", label: "Blue Hole", ring: "BLUE HOLE · THE ICON · DAHAB", line: "dived the Blue Hole" },
  { key: "canyon", label: "The Canyon", ring: "THE CANYON · SHAFTS OF SUN", line: "dived the Canyon" },
  { key: "night", label: "Night dive", ring: "NIGHT DIVE · TORCHES ON · DAHAB", line: "dived at night" },
  { key: "family-shore", label: "Guest of the family", ring: "GUEST OF THE FAMILY · SINCE 1983", line: "was a guest of the family" },
];

export function stampInfo(key: StampKey): StampInfo {
  return STAMPS.find((s) => s.key === key) ?? STAMPS[0];
}

// A review can carry more than one stamp (a certification and a site, say). Whatever
// order they were picked in, they always display in the same ladder order as the picker.
export function orderStamps(keys: readonly string[]): StampKey[] {
  const valid = new Set(STAMP_KEYS as readonly string[]);
  const chosen = new Set(keys.filter((k) => valid.has(k)));
  return STAMP_KEYS.filter((k) => chosen.has(k));
}
