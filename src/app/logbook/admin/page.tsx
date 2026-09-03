import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import ActionForm from "./ActionForm";
import MediaUpload from "./MediaUpload";
import SignIn from "./SignIn";
import { siteUrl } from "@/lib/logbook/config";
import { moderatorKey } from "@/lib/logbook/session";
import { siteInfo } from "@/lib/logbook/sites";
import { stampInfo } from "@/lib/logbook/stamps";
import { getStore } from "@/lib/logbook/store";
import { TTL, signToken } from "@/lib/logbook/tokens";
import { LIMITS, type EntryStatus, type LogbookEntry } from "@/lib/logbook/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews", robots: { index: false, follow: false } };

const DONE: Record<string, string> = {
  approve: "Approved. It is on the site now.",
  hide: "Hidden. It is off the site.",
  save: "Saved.",
  delete: "Deleted for good.",
};

function when(e: LogbookEntry) {
  return new Date(e.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { key?: string; done?: string; wrong?: string };
}) {
  noStore();
  const key = moderatorKey(searchParams.key);
  if (!key) return <SignIn wrong={searchParams.wrong === "1"} />;

  const store = getStore({ fresh: true });
  const entries = await store.list();
  const base = siteUrl();
  const card = (e: LogbookEntry, print: boolean) =>
    `${base}/api/logbook/${e.id}/card?t=${signToken("share", e.id, TTL.share)}${print ? "&format=print" : ""}`;

  const by = (s: EntryStatus) => entries.filter((e) => e.status === s);
  const waiting = by("pending");
  const live = by("approved");
  const hidden = by("hidden");

  // The full editor. Only what is waiting shows this open; the rest stay folded away.
  const editor = (e: LogbookEntry) => (
    <ActionForm method="post" action="/api/logbook/admin" className="lb-admin__form">
      <input type="hidden" name="key" value={key} />
      <input type="hidden" name="id" value={e.id} />
      <label className="lb-field">
        <span className="lb-mono">Osama&apos;s reply · shows in his handwriting</span>
        <textarea
          name="reply"
          className="lb-admin__input"
          rows={2}
          maxLength={LIMITS.reply.max}
          defaultValue={e.reply}
          placeholder="Great buoyancy. Come back for Advanced."
        />
      </label>
      <MediaUpload name="photoUrl" label="Photo" accept="image/*" current={e.photoUrl} />
      <MediaUpload name="videoUrl" label="Video" accept="video/*" current={e.videoUrl} />
      <label className="lb-consent" style={{ color: "var(--ink)" }}>
        <input type="checkbox" name="featured" value="1" defaultChecked={e.featured} />
        <span>Review of the month (pinned at the top)</span>
      </label>
      <div className="lb-admin__actions">
        <button type="submit" name="action" value="save" className="lb-btn lb-btn--paper">Save</button>
        {e.status !== "approved" ? (
          <button type="submit" name="action" value="approve" className="lb-btn">Put it on the site</button>
        ) : null}
        {e.status !== "hidden" ? (
          <button type="submit" name="action" value="hide" className="lb-btn lb-btn--quiet lb-btn--ink">Hide it</button>
        ) : null}
        <button type="submit" name="action" value="delete" className="lb-btn lb-btn--danger" data-confirm={`Delete the review from ${e.name}? This cannot be undone.`}>
          Delete
        </button>
      </div>
    </ActionForm>
  );

  const body = (e: LogbookEntry) => (
    <>
      <span className="lb-mono" style={{ color: "var(--ink-soft)" }}>
        {when(e)} · {siteInfo(e.site).label} · {stampInfo(e.stamp).label}
        {e.divedOn ? ` · ${e.divedOn}` : ""}
        {e.course ? ` · ${e.course}` : ""}
        {e.flags.length ? ` · flags: ${e.flags.join(", ")}` : ""}
        {e.featured ? " · REVIEW OF THE MONTH" : ""}
      </span>
      <p className="lb-page__note">{e.note}</p>
      <div className="lb-admin__links lb-mono">
        {e.photoUrl ? <a href={e.photoUrl} target="_blank" rel="noopener noreferrer">Photo</a> : null}
        <a href={card(e, false)} target="_blank" rel="noopener noreferrer">Story image</a>
        <a href={card(e, true)} target="_blank" rel="noopener noreferrer">Keepsake</a>
        {e.status === "approved" ? (
          <a href={`/logbook/${e.id}`} target="_blank" rel="noopener noreferrer">See it on the site</a>
        ) : null}
      </div>
      {editor(e)}
    </>
  );

  // A folded row: the name, where and when, and a word for its state. Open it to work on it.
  const folded = (e: LogbookEntry) => (
    <details key={e.id} id={e.id} className={`lb-fold is-${e.status}`}>
      <summary>
        <span className="lb-fold__name">{e.name}&apos;s review</span>
        <span className="lb-fold__meta lb-mono">
          {e.country ? `${e.country} · ` : ""}
          {siteInfo(e.site).label} · {when(e)}
        </span>
        <span className={`lb-admin__status is-${e.status}`}>{e.status === "approved" ? "On the site" : "Hidden"}</span>
      </summary>
      <div className="lb-fold__body">{body(e)}</div>
    </details>
  );

  return (
    <>
      <header className="lb-top lb-top--solid">
        <Link href="/" className="lb-brand">Osama<span>Dives</span></Link>
        <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
          <Link href="/review" className="lb-btn lb-btn--quiet lb-btn--ink">The reviews</Link>
          <form method="post" action="/api/logbook/logout">
            <button type="submit" className="lb-btn lb-btn--quiet lb-btn--ink">Sign out</button>
          </form>
        </div>
      </header>

      <section className="lb-hero" style={{ minHeight: "auto", paddingBottom: "2rem" }}>
        <div className="lb-hero__inner">
          <span className="lb-mono lb-rise">Private · moderation</span>
          <h1 className="lb-h2 lb-rise">
            {waiting.length === 0
              ? "Nothing is waiting for you."
              : `${waiting.length} ${waiting.length === 1 ? "review is" : "reviews are"} waiting for you.`}
          </h1>
          {searchParams.done ? (
            <p className="lb-admin__banner" role="status">{DONE[searchParams.done] ?? "Done."}</p>
          ) : null}
          <p className="lb-stand lb-hero__stand">
            {live.length} on the site, {hidden.length} hidden. Deleting is permanent; hiding can be undone.
          </p>
        </div>
      </section>

      <section className="lb-wall" style={{ paddingTop: "2.5rem", paddingBottom: "3rem", background: "var(--bone)" }}>
        <div className="lb-wall__inner">
          <div className="lb-wall__head" style={{ marginBottom: "1.4rem" }}>
            <span className="lb-mono">Waiting for you · {waiting.length}</span>
          </div>
          {waiting.length === 0 ? (
            <p className="lb-stand" style={{ color: "var(--ink-soft)" }}>
              All caught up. New reviews land here.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "1.2rem" }}>
              {waiting.map((e) => (
                <article key={e.id} id={e.id} className="lb-page lb-admin">
                  <span className="lb-admin__status is-pending">Waiting for you</span>
                  <strong className="lb-page__name" style={{ paddingRight: 0 }}>
                    {e.name}
                    {e.country ? `, ${e.country}` : ""}
                  </strong>
                  {body(e)}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {[
        { rows: live, label: "On the site" },
        { rows: hidden, label: "Hidden" },
      ].map(({ rows, label }) => (
        <section
          key={label}
          className="lb-wall"
          style={{ paddingTop: "2.5rem", paddingBottom: "3rem", background: "var(--bone-dim)" }}
        >
          <div className="lb-wall__inner">
            <div className="lb-wall__head" style={{ marginBottom: "1.2rem" }}>
              <span className="lb-mono">{label} · {rows.length}</span>
            </div>
            {rows.length === 0 ? (
              <p className="lb-stand" style={{ color: "var(--ink-soft)" }}>Nothing here.</p>
            ) : (
              <div className="lb-folds">{rows.map(folded)}</div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
