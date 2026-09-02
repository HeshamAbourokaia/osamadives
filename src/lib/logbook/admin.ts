import { createHash, timingSafeEqual } from "node:crypto";

// The private pages and actions share one passcode, compared in constant time.
export function adminKeyOk(given: unknown): given is string {
  const expected = process.env.LOGBOOK_ADMIN_KEY;
  if (!expected || typeof given !== "string" || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
