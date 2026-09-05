import { NextResponse } from "next/server";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";

export const runtime = "nodejs";
export const revalidate = 60;

// Only what the wall prints. Flags and the hashed ip stay on the server.
const publicFields = (e: LogbookEntry) => ({
  id: e.id, name: e.name, country: e.country, site: e.site, divedOn: e.divedOn, course: e.course,
  stamps: e.stamps, note: e.note, photoUrl: e.photoUrl, createdAt: e.createdAt,
  reply: e.reply, videoUrl: e.videoUrl, featured: e.featured,
});

// Approved reviews, a page at a time. Everything here is already public on the wall,
// so there is nothing to guard; the wall calls this when the reader asks for more, and
// once with all=1 when the reader starts filtering or searching.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  const offset = all ? 0 : Math.max(0, Math.min(5000, Number(url.searchParams.get("offset")) || 0));
  const limit = all ? 1000 : Math.max(1, Math.min(48, Number(url.searchParams.get("limit")) || 24));
  try {
    const store = getStore();
    const [entries, total] = await Promise.all([
      store.list({ status: "approved", limit, offset }),
      store.countStatus("approved"),
    ]);
    return NextResponse.json({ entries: entries.map(publicFields), total, offset, limit });
  } catch (e) {
    console.error("review list failed", e);
    return NextResponse.json({ entries: [], total: 0, offset, limit });
  }
}
