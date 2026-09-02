import { randomBytes } from "node:crypto";

// Crockford base32, lowercase. 10 chars = 50 bits.
const ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz";

export function newId(): string {
  const bytes = randomBytes(10);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += ALPHABET[bytes[i] & 31];
  return out;
}

export function isValidId(id: unknown): id is string {
  return typeof id === "string" && /^[0-9a-hj-km-np-tv-z]{10}$/.test(id);
}
