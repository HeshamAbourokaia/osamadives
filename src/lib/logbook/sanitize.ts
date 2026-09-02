// Text hygiene for what students type. Contact details are rejected outright
// (students never need them here, spammers always do) rather than edited out
// silently, so the person sees a clear reason.

// Every control character except newline and tab (Unicode category Cc).
const CONTROL_RE = /[^\P{Cc}\n\t]/gu;

export function cleanText(input: unknown, max: number, keepNewlines = false): string {
  if (typeof input !== "string") return "";
  let s = input.normalize("NFC").replace(/\r\n?/g, "\n").replace(CONTROL_RE, "");
  s = keepNewlines
    ? s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n")
    : s.replace(/\s+/g, " ");
  return s.trim().slice(0, max);
}

export type Forbidden = "link" | "email" | "phone";

const URL_RE = /(https?:\/\/|www\.)\S+/i;
const DOMAIN_RE = /\b[a-z0-9-]+\.(com|net|org|io|co|uk|de|ru|eg|me|app|site|xyz|info|biz)\b/i;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;

export function findForbidden(text: string): Forbidden | null {
  if (URL_RE.test(text)) return "link";
  if (EMAIL_RE.test(text)) return "email"; // before the bare-domain check: every email contains one
  if (DOMAIN_RE.test(text)) return "link";
  for (const m of text.matchAll(PHONE_RE)) {
    const digits = m[0].replace(/\D/g, "").length;
    if (digits >= 9) return "phone"; // dates like 2026-05-12 have 8 digits, phones have 9 or more
  }
  return null;
}

export const FORBIDDEN_MESSAGE: Record<Forbidden, string> = {
  link: "Links can't go in the logbook. Just your words.",
  email: "Please leave email addresses out. Osama has your note.",
  phone: "Please leave phone numbers out. WhatsApp Osama directly for that.",
};
