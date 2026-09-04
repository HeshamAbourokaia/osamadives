import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileStore } from "./store";
import type { LogbookEntry, ReviewComment } from "./types";

const entry = (id: string, createdAt: string, ipHash = "ip1"): LogbookEntry => ({
  id, createdAt, status: "pending", name: "Ana", country: "Spain", site: "blue-hole-dahab",
  divedOn: "2026-05", course: "Open Water", stamps: ["open-water"], note: "Thank you Osama, I felt safe the whole way.",
  photoUrl: null, flags: [], moderatedAt: null, ipHash, reply: "", featured: false, videoUrl: null,
});

describe("FileStore", () => {
  let dir: string;
  let store: FileStore;
  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "logbook-"));
    store = new FileStore(path.join(dir, "nested", "logbook.json"));
  });
  afterEach(() => fs.rm(dir, { recursive: true, force: true }));

  it("creates, reads back, lists newest first and filters by status", async () => {
    await store.create(entry("a", "2026-09-01T00:00:00.000Z"));
    await store.create(entry("b", "2026-09-02T00:00:00.000Z"));
    expect((await store.get("a"))?.name).toBe("Ana");
    expect((await store.list()).map((e) => e.id)).toEqual(["b", "a"]);
    await store.setStatus("a", "approved", "2026-09-03T00:00:00.000Z");
    expect((await store.list({ status: "approved" })).map((e) => e.id)).toEqual(["a"]);
    expect((await store.list({ status: "pending" })).map((e) => e.id)).toEqual(["b"]);
    expect((await store.get("a"))?.moderatedAt).toBe("2026-09-03T00:00:00.000Z");
  });
  it("refuses duplicate ids and returns null for unknown ids", async () => {
    await store.create(entry("a", "2026-09-01T00:00:00.000Z"));
    await expect(store.create(entry("a", "2026-09-01T00:00:00.000Z"))).rejects.toThrow(/duplicate/);
    expect(await store.get("zzz")).toBeNull();
    expect(await store.setStatus("zzz", "hidden", "2026-09-03T00:00:00.000Z")).toBeNull();
  });
  it("survives concurrent creates", async () => {
    await Promise.all(Array.from({ length: 12 }, (_, i) => store.create(entry(`id${i}`, `2026-09-0${(i % 9) + 1}T00:00:00.000Z`))));
    expect(await store.list()).toHaveLength(12);
  });
  it("counts submissions per ip since a time", async () => {
    await store.create(entry("a", "2026-09-01T00:00:00.000Z", "x"));
    await store.create(entry("b", "2026-09-02T00:00:00.000Z", "x"));
    await store.create(entry("c", "2026-09-02T00:00:00.000Z", "y"));
    expect(await store.countSince("x", "2026-09-01T12:00:00.000Z")).toBe(1);
    expect(await store.countSince("x", "2026-08-01T00:00:00.000Z")).toBe(2);
  });

  it("updates reply, featured and video, and fills defaults for old rows", async () => {
    await store.create(entry("a", "2026-09-01T00:00:00.000Z"));
    const u = await store.update("a", { reply: "Great buoyancy. Come back for Advanced.", featured: true });
    expect(u?.reply).toBe("Great buoyancy. Come back for Advanced.");
    expect(u?.featured).toBe(true);
    expect((await store.update("a", { videoUrl: "/logbook/wedding.mp4" }))?.videoUrl).toBe("/logbook/wedding.mp4");
    expect(await store.update("zzz", { reply: "x" })).toBeNull();
    const file = path.join(dir, "nested", "logbook.json");
    const rows = JSON.parse(await fs.readFile(file, "utf8")) as Record<string, unknown>[];
    delete rows[0].reply; delete rows[0].featured; delete rows[0].videoUrl;
    await fs.writeFile(file, JSON.stringify(rows));
    const old = await store.get("a");
    expect(old?.reply).toBe("");
    expect(old?.featured).toBe(false);
    expect(old?.videoUrl).toBeNull();
  });

  it("carries more than one stamp, and still reads a row saved before that with one", async () => {
    await store.create(entry("a", "2026-09-01T00:00:00.000Z"));
    const u = await store.update("a", { stamps: ["blue-hole", "deep-specialty"] });
    expect(u?.stamps).toEqual(["blue-hole", "deep-specialty"]);
    expect((await store.get("a"))?.stamps).toEqual(["blue-hole", "deep-specialty"]);

    const file = path.join(dir, "nested", "logbook.json");
    const rows = JSON.parse(await fs.readFile(file, "utf8")) as Record<string, unknown>[];
    delete rows[0].stamps;
    rows[0].stamp = "open-water"; // the shape a review had before it could carry more than one
    await fs.writeFile(file, JSON.stringify(rows));
    expect((await store.get("a"))?.stamps).toEqual(["open-water"]);
  });

  it("toggles a reaction on and off per device, and counts across devices", async () => {
    await store.create(entry("a", "2026-09-01T00:00:00.000Z"));
    expect(await store.toggleReaction("a", "🦈", "phone1", "2026-09-02T00:00:00.000Z")).toBe(true);
    expect(await store.toggleReaction("a", "🦈", "phone2", "2026-09-02T00:00:01.000Z")).toBe(true);
    expect(await store.toggleReaction("a", "❤️", "phone1", "2026-09-02T00:00:02.000Z")).toBe(true);
    expect(await store.reactionCounts(["a", "zzz"])).toEqual({ a: { "🦈": 2, "❤️": 1 } });
    expect(await store.reactionsBy(["a"], "phone1")).toEqual({ a: ["🦈", "❤️"] });
    expect(await store.toggleReaction("a", "🦈", "phone1", "2026-09-02T00:00:03.000Z")).toBe(false);
    expect(await store.reactionCounts(["a"])).toEqual({ a: { "🦈": 1, "❤️": 1 } });
    expect(await store.reactionsBy(["a"], "phone1")).toEqual({ a: ["❤️"] });
  });

  it("keeps comments pending until moderated, counts only approved ones, and rate-limits by ip", async () => {
    await store.create(entry("a", "2026-09-01T00:00:00.000Z"));
    const c = (id: string, createdAt: string, ipHash = "ip1"): ReviewComment => ({
      id, entryId: "a", createdAt, status: "pending", name: "Ben", text: "Same, Osama is the best.",
      deviceId: "phone1", ipHash, moderatedAt: null,
    });
    await store.createComment(c("c2", "2026-09-03T00:00:00.000Z"));
    await store.createComment(c("c1", "2026-09-02T00:00:00.000Z"));
    await expect(store.createComment(c("c1", "2026-09-02T00:00:00.000Z"))).rejects.toThrow(/duplicate/);
    expect((await store.listComments({ entryId: "a" })).map((x) => x.id)).toEqual(["c1", "c2"]);
    expect(await store.commentCounts(["a"])).toEqual({});
    expect((await store.setCommentStatus("c1", "approved", "2026-09-04T00:00:00.000Z"))?.moderatedAt).toBe("2026-09-04T00:00:00.000Z");
    expect(await store.commentCounts(["a"])).toEqual({ a: 1 });
    expect((await store.listComments({ entryId: "a", status: "approved" })).map((x) => x.id)).toEqual(["c1"]);
    expect(await store.countCommentsSince("ip1", "2026-09-02T12:00:00.000Z")).toBe(1);
    expect(await store.removeComment("c2")).toBe(true);
    expect(await store.removeComment("c2")).toBe(false);
    expect(await store.setCommentStatus("zzz", "hidden", "2026-09-04T00:00:00.000Z")).toBeNull();
  });
});
