export type EntryStatus = "pending" | "approved" | "hidden";

export const SITE_KEYS = [
  "lighthouse-reef-dahab",
  "eel-garden-dahab",
  "three-pools-dahab",
  "the-canyon-dahab",
  "blue-hole-dahab",
  "elsewhere",
] as const;
export type SiteKey = (typeof SITE_KEYS)[number];

export const STAMP_KEYS = [
  "first-breath",
  "open-water",
  "advanced",
  "rescue",
  "blue-hole",
  "canyon",
  "night",
  "family-shore",
] as const;
export type StampKey = (typeof STAMP_KEYS)[number];

export const COURSES = [
  "",
  "Intro dive",
  "Open Water",
  "Advanced",
  "Rescue Diver",
  "Divemaster",
  "Specialty",
  "Fun dives",
] as const;
export type Course = (typeof COURSES)[number];

export interface LogbookEntry {
  id: string;
  createdAt: string;
  status: EntryStatus;
  name: string;
  country: string;
  site: SiteKey;
  divedOn: string;
  course: Course;
  stamp: StampKey;
  note: string;
  photoUrl: string | null;
  flags: string[];
  moderatedAt: string | null;
  ipHash: string;
  reply: string;
  featured: boolean;
  videoUrl: string | null;
}

export interface EntryPatch {
  reply?: string;
  featured?: boolean;
  videoUrl?: string | null;
}

export const LIMITS = {
  name: { min: 2, max: 40 },
  country: { max: 40 },
  note: { min: 12, max: 600 },
  reply: { max: 280 },
  photoBytes: 6 * 1024 * 1024,
} as const;
