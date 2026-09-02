const DEV_SECRET = "dev-only-secret-do-not-use-in-production";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function logbookSecret(): string {
  const s = process.env.LOGBOOK_SECRET;
  if (s && s.length >= 16) return s;
  if (isProduction()) throw new Error("LOGBOOK_SECRET is not set");
  return DEV_SECRET;
}

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// The logbook is "open" when a database exists (Vercel injects DATABASE_URL) or in development.
export function storageReady(): boolean {
  return Boolean(process.env.DATABASE_URL) || !isProduction();
}
