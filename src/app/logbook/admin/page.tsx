import { createHash, timingSafeEqual } from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/logbook/config";
import { siteInfo } from "@/lib/logbook/sites";
import { stampInfo } from "@/lib/logbook/stamps";
import { getStore } from "@/lib/logbook/store";
import { TTL, signToken } from "@/lib/logbook/tokens";
import type { EntryStatus, LogbookEntry } from "@/lib/logbook/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Logbook moderation", robots: { index: false, follow: false } };

function keyOk(given: string | undefined): boolean {
  const expected = process.env.LOGBOOK_ADMIN_KEY;
  if (!expected || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const ORDER: EntryStatus[] = ["pending", "approved", "hidden"];

export default async function AdminPage({ searchParams }: { searchParams: { key?: string } }) {
  if (!keyOk(searchParams.key)) notFound();
  const entries = await getStore().list();
  const base = siteUrl();
  const link = (e: LogbookEntry, action: "approve" | "hide") =>
    `${base}/api/logbook/moderate?id=${e.id}&action=${action}&t=${signToken("moderate", e.id, TTL.moderate)}`;

  return (
    <>
      <header className="lb-top">
        <Link href="/" className="lb-brand">Osama<span>Dives</span></Link>
        <Link href="/logbook" className="lb-btn lb-btn--quiet">Open the logbook</Link>
      </header>
      <section className="lb-hero" style={{ minHeight: "auto", paddingBottom: "2rem" }}>
        <div className="lb-hero__inner">
          <span className="lb-mono lb-rise">Private · moderation</span>
          <h1 className="lb-h2 lb-rise">Every page, every state.</h1>
          <p className="lb-stand lb-hero__stand">{entries.filter((e) => e.status === "pending").length} waiting. Approve puts a page in the book, Hide takes it out. Both can be undone.</p>
        </div>
      </section>
      {ORDER.map((status) => {
        const rows = entries.filter((e) => e.status === status);
        return (
          <section key={status} className="lb-wall" style={{ paddingTop: "3rem", paddingBottom: "3rem", background: status === "pending" ? "var(--bone)" : "var(--bone-dim)" }}>
            <div className="lb-wall__inner">
              <div className="lb-wall__head" style={{ marginBottom: "1.6rem" }}>
                <span className="lb-mono">{status} · {rows.length}</span>
              </div>
              {rows.length === 0 ? <p className="lb-stand" style={{ color: "var(--ink-soft)" }}>Nothing here.</p> : null}
              <div style={{ display: "grid", gap: "1rem" }}>
                {rows.map((e) => (
                  <article key={e.id} className="lb-page" style={{ gridTemplateColumns: "1fr auto", alignItems: "start" }}>
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <span className="lb-mono" style={{ color: "var(--ink-soft)" }}>
                        {new Date(e.createdAt).toLocaleString("en-GB")} · {siteInfo(e.site).label} · {stampInfo(e.stamp).label}
                        {e.flags.length ? ` · flags: ${e.flags.join(", ")}` : ""}
                      </span>
                      <strong className="lb-page__name" style={{ paddingRight: 0 }}>{e.name}{e.country ? `, ${e.country}` : ""}</strong>
                      <p className="lb-page__note">{e.note}</p>
                      {e.photoUrl ? <a href={e.photoUrl} target="_blank" rel="noopener noreferrer" className="lb-mono" style={{ color: "var(--reef)" }}>Photo</a> : null}
                    </div>
                    <div style={{ display: "grid", gap: "0.5rem", position: "relative" }}>
                      {status !== "approved" ? <a className="lb-btn lb-btn--paper" href={link(e, "approve")}>Approve</a> : null}
                      {status !== "hidden" ? <a className="lb-btn lb-btn--quiet" style={{ color: "var(--ink)", borderColor: "rgba(23,18,8,0.3)" }} href={link(e, "hide")}>Hide</a> : null}
                      <a className="lb-mono" style={{ color: "var(--reef)", textAlign: "center" }} href={`${base}/api/logbook/${e.id}/card?t=${signToken("share", e.id, TTL.share)}`} target="_blank" rel="noopener noreferrer">Card</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
