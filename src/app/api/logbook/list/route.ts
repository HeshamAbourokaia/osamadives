import { NextResponse } from "next/server";
import { getStore } from "@/lib/logbook/store";

export const runtime = "nodejs";
export const revalidate = 60;

// Approved reviews, a page at a time. Everything here is already public on the wall,
// so there is nothing to guard; the wall calls this when the reader asks for more.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const offset = Math.max(0, Math.min(5000, Number(url.searchParams.get("offset")) || 0));
  const limit = Math.max(1, Math.min(48, Number(url.searchParams.get("limit")) || 24));
  try {
    const store = getStore();
    const [entries, total] = await Promise.all([
      store.list({ status: "approved", limit, offset }),
      store.countStatus("approved"),
    ]);
    return NextResponse.json({ entries, total, offset, limit });
  } catch (e) {
    console.error("review list failed", e);
    return NextResponse.json({ entries: [], total: 0, offset, limit });
  }
}
