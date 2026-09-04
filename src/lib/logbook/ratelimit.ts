import { createHash } from "node:crypto";
import { logbookSecret } from "./config";

// IPs are stored hashed with the site secret: enough to rate-limit, not enough to identify.
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${logbookSecret()}:${ip}`).digest("hex").slice(0, 32);
}

const recent = new Map<string, number[]>();

// Per-instance burst guard: max `limit` submissions per `windowMs` from one IP hash.
export function allowBurst(ipHash: string, limit = 3, windowMs = 10 * 60 * 1000, now = Date.now()): boolean {
  const times = (recent.get(ipHash) || []).filter((t) => now - t < windowMs);
  if (times.length >= limit) {
    recent.set(ipHash, times);
    return false;
  }
  times.push(now);
  recent.set(ipHash, times);
  return true;
}

export const DAILY_LIMIT = 5;
export const COMMENT_DAILY_LIMIT = 10;

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return (forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "0.0.0.0").trim();
}

// The browser makes itself a random id the first time it reacts, and keeps it in localStorage.
// It tells one phone from another, nothing more: no account, no cookie, no name attached.
export function validDeviceId(v: unknown): v is string {
  return typeof v === "string" && /^[a-z0-9-]{8,64}$/i.test(v);
}
