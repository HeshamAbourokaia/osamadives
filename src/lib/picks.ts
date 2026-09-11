import { theName } from "./contact";

/**
 * Build your message. Tap a site or a course anywhere on the site and it joins the
 * WhatsApp message the green pill sends, so the first message Osama gets already says
 * what the person wants to talk about. It lives in the phone's own storage, never on a
 * server, and it is a conversation opener: no prices, no booking, just the talk.
 */
export type Pick = { id: string; label: string; kind: "site" | "course" };

const KEY = "od-picks";
const EVENT = "od:picks";
const NUMBER = "201090208050";
/** A message that was never sent goes away after three hours, so the next person to
    pick up the phone does not inherit somebody else's plan. */
export const PICKS_TTL_MS = 3 * 60 * 60 * 1000;

export function readPicks(): Pick[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Pick[] | { list: Pick[]; at: number };
    const list = Array.isArray(parsed) ? parsed : parsed?.list;
    const at = Array.isArray(parsed) ? 0 : Number(parsed?.at ?? 0);
    if (!Array.isArray(list) || (at && Date.now() - at > PICKS_TTL_MS) || (!at)) { if (!Array.isArray(list) || !at) localStorage.removeItem(KEY); return []; }
    return list.filter((p) => p && typeof p.id === "string" && typeof p.label === "string");
  } catch {
    return [];
  }
}

function writePicks(list: Pick[]) {
  try { if (list.length) localStorage.setItem(KEY, JSON.stringify({ list, at: Date.now() })); else localStorage.removeItem(KEY); } catch { /* private mode: the message still sends */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
}

export function togglePick(pick: Pick): { list: Pick[]; added: boolean } {
  const list = readPicks();
  const had = list.some((p) => p.id === pick.id);
  const next = had ? list.filter((p) => p.id !== pick.id) : [...list, pick];
  writePicks(next);
  return { list: next, added: !had };
}

export function removePick(id: string) {
  writePicks(readPicks().filter((p) => p.id !== id));
}

export function clearPicks() {
  writePicks([]);
}

export function onPicks(cb: (list: Pick[]) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Pick[]>).detail ?? readPicks());
  const storage = (e: StorageEvent) => { if (e.key === KEY) cb(readPicks()); };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener(EVENT, handler); window.removeEventListener("storage", storage); };
}

function list(words: string[]) {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** The words the pill sends, in a shape a person is happy to send unchanged. */
export function composeMessage(picks: Pick[], level?: string | null) {
  // "The Canyon" mid-sentence is "the Canyon"
  const sites = picks.filter((p) => p.kind === "site").map((p) => theName(p.label).replace(/^The\s/, "the "));
  const courses = picks.filter((p) => p.kind === "course").map((p) => (/^intro/i.test(p.label) ? "an intro dive" : `the ${p.label} course`));
  const parts: string[] = [];
  if (sites.length) parts.push(`diving ${list(sites)}`);
  if (courses.length) parts.push(list(courses));
  const about = parts.length ? ` I would love to talk about ${list(parts)}.` : " I would love to chat about diving in Dahab.";
  const who = level ? ` ${level}.` : "";
  return `Hi Osama! I found you on osamadives.com.${about}${who}`;
}

export function whatsappFor(text: string) {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
}

/** The four things people actually ask first, each one a message ready to send. */
export const QUICK_QUESTIONS = [
  "I have never dived before. Where would I start with you?",
  "I am Open Water certified. Could I dive the Blue Hole with you?",
  "I am coming to Dahab soon. What days are you in the water?",
  "Do you teach children, and can we do it in Arabic?",
];
