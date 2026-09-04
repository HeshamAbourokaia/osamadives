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
  // The certification ladder, youngest and earliest to most advanced.
  "seal-team",
  "bubblemaker",
  "introduction",
  "dsd",
  "open-water",
  "advanced",
  "deep-specialty",
  "nitrox",
  "rescue",
  "divemaster",
  "dpv-diver",
  "night-diver-specialty",
  "peak-performance-buoyancy",
  // Sites and moments, not courses.
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
  /** What Osama chose to mark this dive with. One at first; he can add more later. */
  stamps: StampKey[];
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
  photoUrl?: string | null;
  stamps?: StampKey[];
}

// Every reaction is a good one; there is no thumbs down. The diving set is the closest
// Unicode gets to a scuba diver (a mask, not a diver) and renders on iOS 12+ and Android 9+.
export const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🤿", "🦈", "🐢", "🐙", "🌊", "🐠"] as const;
export type Reaction = (typeof REACTIONS)[number];

// A short word under a review, from a reader. Osama reads it before it shows, like a review.
export interface ReviewComment {
  id: string;
  entryId: string;
  createdAt: string;
  status: EntryStatus;
  name: string;
  text: string;
  /** Random id the browser made for itself; tells one phone from another, not one person from another. */
  deviceId: string;
  ipHash: string;
  moderatedAt: string | null;
}

export const LIMITS = {
  name: { min: 2, max: 40 },
  country: { max: 40 },
  note: { min: 12, max: 600 },
  reply: { max: 280 },
  comment: { min: 2, max: 280 },
  photoBytes: 6 * 1024 * 1024,
  mediaBytes: 200 * 1024 * 1024,   // Osama uploading straight from his phone
} as const;
