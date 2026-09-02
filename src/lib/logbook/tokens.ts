import { createHmac, timingSafeEqual } from "node:crypto";
import { logbookSecret } from "./config";

export type TokenPurpose = "moderate" | "share";

function sign(purpose: TokenPurpose, id: string, exp: number, secret: string): string {
  return createHmac("sha256", secret).update(`${purpose}:${id}:${exp}`).digest("hex");
}

// Token = "<expiry unix seconds>-<hmac hex>". URL safe, no encoding needed.
export function signToken(
  purpose: TokenPurpose,
  id: string,
  ttlSeconds: number,
  secret = logbookSecret(),
  now = Date.now(),
): string {
  const exp = Math.floor(now / 1000) + ttlSeconds;
  return `${exp}-${sign(purpose, id, exp, secret)}`;
}

export function verifyToken(
  purpose: TokenPurpose,
  id: string,
  token: unknown,
  secret = logbookSecret(),
  now = Date.now(),
): boolean {
  if (typeof token !== "string") return false;
  const m = /^(\d{1,12})-([0-9a-f]{64})$/.exec(token);
  if (!m) return false;
  const exp = Number(m[1]);
  if (exp * 1000 < now) return false;
  const expected = Buffer.from(sign(purpose, id, exp, secret), "hex");
  const given = Buffer.from(m[2], "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export const TTL = {
  moderate: 60 * 60 * 24 * 30, // Approve / Hide links stay valid for 30 days
  share: 60 * 60 * 24 * 7, // a submitter's own card link, 7 days
} as const;
