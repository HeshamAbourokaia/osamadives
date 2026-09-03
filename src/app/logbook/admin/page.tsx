import Link from "next/link";
import { notFound } from "next/navigation";
import { adminKeyOk } from "@/lib/logbook/admin";
import ActionForm from "./ActionForm";
import { siteUrl } from "@/lib/logbook/config";
import { siteInfo } from "@/lib/logbook/sites";
import { stampInfo } from "@/lib/logbook/stamps";
import { getStore } from "@/lib/logbook/store";
import { TTL, signToken } from "@/lib/logbook/tokens";
import { LIMITS, type EntryStatus, type LogbookEntry } from "@/lib/logbook/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Logbook moderation", robots: { index: false, follow: false } };

const ORDER: EntryStatus[] = ["pending", "approved", "hidden"];

const SECTION: Record<string, string> = { pending: "Waiting for you", approved: "On the site", hidden: "Hidden" };
const STATUS: Record<string, string> = { pending: "Waiting for you", approved: "On the site", hidden: "Hidden, not on the site" };
const DONE: Record<string, string> = { hide: "Hidden. It is off the site.", approve: "Approved. It is on the site now.", save: "Saved." };

export default async function AdminPage({ searchParams }: { searchParams: { key?: string; done?: string } }) {
  const key = searchParams.key;
  if (!adminKeyOk(key)) notFound();
  const entries = await getStore().list();
  const base = siteUrl();
  const card = (e: LogbookEntry, print: boolean) =>
    `${base}/api/logbook/${e.id}/card?t=${signToken("share", e.id, TTL.share)}${print ? "&format=print" : ""}`;
  const pending = entries.filter((e) => e.status === "pending").length;

  return (
    <>
      <header className="lb-top lb-top--solid">
        <Link href="/" className="lb-brand">Osama<span>Dives</span></Link>
        <Link href="/logbook" className="lb-btn lb-btn--quiet">Open the reviews</Link>
      </header>
      <section className="lb-hero" style={{ minHeight: "auto", paddingBottom: "2rem" }}>
        <div className="lb-hero__inner">
          <span className="lb-mono lb-rise">Private · moderation</span>
          <h1 className="lb-h2 lb-rise">Every review, every state.</h1>
          {searchParams.done ? <p className="lb-admin__banner" role="status">{DONE[searchParams.done] ?? "Done."}</p> : null}
          <p className="lb-stand lb-hero__stand">
            {pending} waiting for you. Approve puts a review on the site, Hide takes it down. A reply shows on the review in Osama&apos;s
            handwriting. Tick &ldquo;review of the month&rdquo; to pin one at the top.
          </p>
        </div>
      </section>
      {ORDER.map((status) => {
        const rows = entries.filter((e) => e.status === status);
        return (
          <section key={status} className="lb-wall" style={{ paddingTop: "3rem", paddingBottom: "3rem", background: status === "pending" ? "var(--bone)" : "var(--bone-dim)" }}>
            <div className="lb-wall__inner">
              <div className="lb-wall__head" style={{ marginBottom: "1.6rem" }}>
                <span className="lb-mono">{SECTION[status]} · {rows.length}</span>
              </div>
              {rows.length === 0 ? <p className="lb-stand" style={{ color: "var(--ink-soft)" }}>Nothing here.</p> : null}
              <div style={{ display: "grid", gap: "1.2rem" }}>
                {rows.map((e) => (
                  <article key={e.id} id={e.id} className="lb-page lb-admin">
                    <span className="lb-mono" style={{ color: "var(--ink-soft)" }}>
                      {new Date(e.createdAt).toLocaleString("en-GB")} · {siteInfo(e.site).label} · {stampInfo(e.stamp).label}
                      {e.divedOn ? ` · ${e.divedOn}` : ""}{e.course ? ` · ${e.course}` : ""}
                      {e.flags.length ? ` · flags: ${e.flags.join(", ")}` : ""}{e.featured ? " · REVIEW OF THE MONTH" : ""}
                    </span>
                    <span className={`lb-admin__status is-${e.status}`}>{STATUS[e.status]}</span>
                    <strong className="lb-page__name" style={{ paddingRight: 0 }}>{e.name}{e.country ? `, ${e.country}` : ""}</strong>
                    <p className="lb-page__note">{e.note}</p>
                    <div className="lb-admin__links lb-mono">
                      {e.photoUrl ? <a href={e.photoUrl} target="_blank" rel="noopener noreferrer">Photo</a> : null}
                      <a href={card(e, false)} target="_blank" rel="noopener noreferrer">Story image</a>
                      <a href={card(e, true)} target="_blank" rel="noopener noreferrer">Keepsake</a>
                      {e.status === "approved" ? <a href={`/logbook/${e.id}`} target="_blank" rel="noopener noreferrer">Live page</a> : null}
                    </div>
                    <ActionForm method="post" action="/api/logbook/admin" className="lb-admin__form">
                      <input type="hidden" name="key" value={key} />
                      <input type="hidden" name="id" value={e.id} />
                      <label className="lb-field">
                        <span className="lb-mono">Osama&apos;s reply · shows in his handwriting</span>
                        <textarea name="reply" className="lb-admin__input" rows={2} maxLength={LIMITS.reply.max} defaultValue={e.reply} placeholder="Great buoyancy. Come back for Advanced." />
                      </label>
                      <label className="lb-field">
                        <span className="lb-mono">Video link · optional, an mp4 on this site or https</span>
                        <input name="videoUrl" className="lb-admin__input" defaultValue={e.videoUrl ?? ""} placeholder="/logbook/wedding.mp4" />
                      </label>
                      <label className="lb-consent" style={{ color: "var(--ink)" }}>
                        <input type="checkbox" name="featured" value="1" defaultChecked={e.featured} />
                        <span>Review of the month (pinned at the top)</span>
                      </label>
                      <div className="lb-admin__actions">
                        <button type="submit" name="action" value="save" className="lb-btn lb-btn--paper">Save</button>
                        {e.status !== "approved" ? <button type="submit" name="action" value="approve" className="lb-btn">Approve</button> : null}
                        {e.status !== "hidden" ? <button type="submit" name="action" value="hide" className="lb-btn lb-btn--quiet" style={{ color: "var(--ink)", borderColor: "rgba(23,18,8,0.3)" }}>Hide</button> : null}
                      </div>
                    </ActionForm>
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
