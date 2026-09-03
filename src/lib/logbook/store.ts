import { promises as fs } from "node:fs";
import path from "node:path";
import type { EntryPatch, EntryStatus, LogbookEntry } from "./types";

export interface ListOptions {
  status?: EntryStatus;
  limit?: number;
}

export interface LogbookStore {
  create(entry: LogbookEntry): Promise<void>;
  get(id: string): Promise<LogbookEntry | null>;
  list(opts?: ListOptions): Promise<LogbookEntry[]>;
  setStatus(id: string, status: EntryStatus, moderatedAt: string): Promise<LogbookEntry | null>;
  update(id: string, patch: EntryPatch): Promise<LogbookEntry | null>;
  countSince(ipHash: string, sinceIso: string): Promise<number>;
}

const byNewest = (a: LogbookEntry, b: LogbookEntry) => (a.createdAt < b.createdAt ? 1 : -1);

// ---------------------------------------------------------------------------
// FileStore: one JSON file, for local development. Writes are serialised and
// atomic (tmp + rename) so a crash never leaves a half-written file.
// ---------------------------------------------------------------------------
export class FileStore implements LogbookStore {
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private readonly file: string) {}

  private async readAll(): Promise<LogbookEntry[]> {
    try {
      const rows = JSON.parse(await fs.readFile(this.file, "utf8")) as Partial<LogbookEntry>[];
      // Rows written before a field existed get its default.
      return rows.map((r) => ({ reply: "", featured: false, videoUrl: null, ...r }) as LogbookEntry);
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw e;
    }
  }

  private async writeAll(entries: LogbookEntry[]): Promise<void> {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(entries, null, 2));
    await fs.rename(tmp, this.file);
  }

  private locked<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.catch(() => undefined);
    return run;
  }

  create(entry: LogbookEntry) {
    return this.locked(async () => {
      const all = await this.readAll();
      if (all.some((e) => e.id === entry.id)) throw new Error(`duplicate id ${entry.id}`);
      all.push(entry);
      await this.writeAll(all);
    });
  }

  async get(id: string) {
    return (await this.readAll()).find((e) => e.id === id) ?? null;
  }

  async list(opts: ListOptions = {}) {
    const all = (await this.readAll()).filter((e) => !opts.status || e.status === opts.status);
    all.sort(byNewest);
    return opts.limit ? all.slice(0, opts.limit) : all;
  }

  setStatus(id: string, status: EntryStatus, moderatedAt: string) {
    return this.locked(async () => {
      const all = await this.readAll();
      const e = all.find((x) => x.id === id);
      if (!e) return null;
      e.status = status;
      e.moderatedAt = moderatedAt;
      await this.writeAll(all);
      return e;
    });
  }

  update(id: string, patch: EntryPatch) {
    return this.locked(async () => {
      const all = await this.readAll();
      const e = all.find((x) => x.id === id);
      if (!e) return null;
      if (patch.reply !== undefined) e.reply = patch.reply;
      if (patch.featured !== undefined) e.featured = patch.featured;
      if (patch.videoUrl !== undefined) e.videoUrl = patch.videoUrl;
      await this.writeAll(all);
      return e;
    });
  }

  async countSince(ipHash: string, sinceIso: string) {
    return (await this.readAll()).filter((e) => e.ipHash === ipHash && e.createdAt >= sinceIso).length;
  }
}

// ---------------------------------------------------------------------------
// NeonStore: Postgres on Vercel (Neon). The table is created on first use, so
// there is no migration step to remember.
// ---------------------------------------------------------------------------
type Row = {
  id: string; created_at: string; status: string; name: string; country: string; site: string;
  dived_on: string; course: string; stamp: string; note: string; photo_url: string | null;
  flags: unknown; moderated_at: string | null; ip_hash: string;
  reply: string | null; featured: boolean | null; video_url: string | null;
};

const fromRow = (r: Row): LogbookEntry => ({
  id: r.id,
  createdAt: new Date(r.created_at).toISOString(),
  status: r.status as EntryStatus,
  name: r.name,
  country: r.country,
  site: r.site as LogbookEntry["site"],
  divedOn: r.dived_on,
  course: r.course as LogbookEntry["course"],
  stamp: r.stamp as LogbookEntry["stamp"],
  note: r.note,
  photoUrl: r.photo_url,
  flags: Array.isArray(r.flags) ? (r.flags as string[]) : [],
  moderatedAt: r.moderated_at ? new Date(r.moderated_at).toISOString() : null,
  ipHash: r.ip_hash,
  reply: r.reply ?? "",
  featured: Boolean(r.featured),
  videoUrl: r.video_url,
});

export class NeonStore implements LogbookStore {
  private ready: Promise<void> | null = null;
  private sql: ReturnType<typeof import("@neondatabase/serverless").neon> | null = null;

  // The driver talks over fetch, and Next caches fetches made while rendering. The public pages
  // want that cache (they are rebuilt on a timer and whenever a review is moderated); the private
  // moderation page must never see a stale list, so it asks for a no-store connection instead.
  constructor(private readonly url: string, private readonly fresh = false) {}

  private async db() {
    if (!this.sql) {
      const { neon } = await import("@neondatabase/serverless");
      this.sql = this.fresh ? neon(this.url, { fetchOptions: { cache: "no-store" } }) : neon(this.url);
    }
    if (!this.ready) {
      const sql = this.sql;
      this.ready = (async () => {
        await sql`CREATE TABLE IF NOT EXISTS logbook_entries (
          id text PRIMARY KEY,
          created_at timestamptz NOT NULL,
          status text NOT NULL,
          name text NOT NULL,
          country text NOT NULL DEFAULT '',
          site text NOT NULL,
          dived_on text NOT NULL DEFAULT '',
          course text NOT NULL DEFAULT '',
          stamp text NOT NULL,
          note text NOT NULL,
          photo_url text,
          flags jsonb NOT NULL DEFAULT '[]'::jsonb,
          moderated_at timestamptz,
          ip_hash text NOT NULL DEFAULT ''
        )`;
        await sql`CREATE INDEX IF NOT EXISTS logbook_status_created ON logbook_entries (status, created_at DESC)`;
        await sql`ALTER TABLE logbook_entries ADD COLUMN IF NOT EXISTS reply text NOT NULL DEFAULT ''`;
        await sql`ALTER TABLE logbook_entries ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false`;
        await sql`ALTER TABLE logbook_entries ADD COLUMN IF NOT EXISTS video_url text`;
      })();
    }
    await this.ready;
    return this.sql;
  }

  async create(e: LogbookEntry) {
    const sql = await this.db();
    await sql`INSERT INTO logbook_entries
      (id, created_at, status, name, country, site, dived_on, course, stamp, note, photo_url, flags, moderated_at, ip_hash, reply, featured, video_url)
      VALUES (${e.id}, ${e.createdAt}, ${e.status}, ${e.name}, ${e.country}, ${e.site}, ${e.divedOn}, ${e.course},
              ${e.stamp}, ${e.note}, ${e.photoUrl}, ${JSON.stringify(e.flags)}::jsonb, ${e.moderatedAt}, ${e.ipHash},
              ${e.reply}, ${e.featured}, ${e.videoUrl})`;
  }

  async get(id: string) {
    const sql = await this.db();
    const rows = (await sql`SELECT * FROM logbook_entries WHERE id = ${id}`) as Row[];
    return rows[0] ? fromRow(rows[0]) : null;
  }

  async list(opts: ListOptions = {}) {
    const sql = await this.db();
    const limit = opts.limit ?? 500;
    const rows = (opts.status
      ? await sql`SELECT * FROM logbook_entries WHERE status = ${opts.status} ORDER BY created_at DESC LIMIT ${limit}`
      : await sql`SELECT * FROM logbook_entries ORDER BY created_at DESC LIMIT ${limit}`) as Row[];
    return rows.map(fromRow);
  }

  async setStatus(id: string, status: EntryStatus, moderatedAt: string) {
    const sql = await this.db();
    const rows = (await sql`UPDATE logbook_entries SET status = ${status}, moderated_at = ${moderatedAt}
      WHERE id = ${id} RETURNING *`) as Row[];
    return rows[0] ? fromRow(rows[0]) : null;
  }

  async update(id: string, patch: EntryPatch) {
    const sql = await this.db();
    const current = await this.get(id);
    if (!current) return null;
    const reply = patch.reply ?? current.reply;
    const featured = patch.featured ?? current.featured;
    const videoUrl = patch.videoUrl === undefined ? current.videoUrl : patch.videoUrl;
    const rows = (await sql`UPDATE logbook_entries SET reply = ${reply}, featured = ${featured}, video_url = ${videoUrl}
      WHERE id = ${id} RETURNING *`) as Row[];
    return rows[0] ? fromRow(rows[0]) : null;
  }

  async countSince(ipHash: string, sinceIso: string) {
    const sql = await this.db();
    const rows = (await sql`SELECT count(*)::int AS n FROM logbook_entries
      WHERE ip_hash = ${ipHash} AND created_at >= ${sinceIso}`) as { n: number }[];
    return rows[0]?.n ?? 0;
  }
}

// ---------------------------------------------------------------------------
let cached: LogbookStore | null = null;
let cachedFresh: LogbookStore | null = null;

// `fresh` skips every layer of caching: use it on the moderation page and in the moderation route,
// where showing the previous state reads as a broken button.
export function getStore(opts: { fresh?: boolean } = {}): LogbookStore {
  const fresh = opts.fresh === true;
  const held = fresh ? cachedFresh : cached;
  if (held) return held;
  const url = process.env.DATABASE_URL;
  let store: LogbookStore;
  if (url) store = new NeonStore(url, fresh);
  else if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is not set");
  else store = new FileStore(path.join(process.env.LOGBOOK_DATA_DIR || path.join(process.cwd(), ".data"), "logbook.json"));
  if (fresh) cachedFresh = store; else cached = store;
  return store;
}
