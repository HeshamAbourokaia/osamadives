/**
 * Your level, set once and kept on the phone. Every dive site can then say whether it
 * is for you now, for after the next card, or one to do with Osama beside you. It is
 * the visitor's own word; nothing checks it, and it only shapes what the page says.
 */
export type Level = "new" | "ow" | "aow" | "pro";

const KEY = "od-level";
const EVENT = "od:level";

export const LEVELS: { id: Level; label: string; says: string }[] = [
  { id: "new", label: "Never dived", says: "I have never dived" },
  { id: "ow", label: "Open Water", says: "I am Open Water certified" },
  { id: "aow", label: "Advanced", says: "I am Advanced certified" },
  { id: "pro", label: "Rescue or above", says: "I am a Rescue Diver or above" },
];

export function readLevel(): Level | null {
  try {
    const v = localStorage.getItem(KEY);
    return LEVELS.some((l) => l.id === v) ? (v as Level) : null;
  } catch {
    return null;
  }
}

export function writeLevel(level: Level | null) {
  try { if (level) localStorage.setItem(KEY, level); else localStorage.removeItem(KEY); } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: level }));
}

export function onLevel(cb: (level: Level | null) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Level | null>).detail ?? readLevel());
  const storage = (e: StorageEvent) => { if (e.key === KEY) cb(readLevel()); };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener(EVENT, handler); window.removeEventListener("storage", storage); };
}

export function levelSays(level: Level | null) {
  return LEVELS.find((l) => l.id === level)?.says ?? null;
}

export type SiteLevel = "All Levels" | "Open Water+" | "Advanced+" | "Technical";

/** What a site says to a diver of a given level. Honest, in Osama's terms. */
export function siteFit(site: SiteLevel, level: Level | null): { tone: "yes" | "next" | "with" | "no"; text: string } {
  if (site === "Technical") return { tone: "no", text: "Technical divers only" };
  if (!level) return { tone: "with", text: "Set your level to see if it is for you" };
  if (site === "All Levels") return level === "new" ? { tone: "yes", text: "Your first dive can be here" } : { tone: "yes", text: "For you" };
  if (site === "Open Water+") return level === "new" ? { tone: "next", text: "After Open Water" } : { tone: "yes", text: "For you" };
  // Advanced+
  if (level === "aow" || level === "pro") return { tone: "yes", text: "For you" };
  if (level === "ow") return { tone: "with", text: "With Osama beside you, or after Advanced" };
  return { tone: "next", text: "After Advanced" };
}
