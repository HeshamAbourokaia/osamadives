import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidId } from "@/lib/logbook/ids";
import { siteInfo } from "@/lib/logbook/sites";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import PageCard from "../PageCard";

export const dynamic = "force-dynamic";

async function approved(id: string): Promise<LogbookEntry | null> {
  if (!isValidId(id)) return null;
  try {
    const e = await getStore().get(id);
    return e && e.status === "approved" ? e : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const e = await approved(params.id);
  if (!e) return { title: "Logbook | OsamaDives", robots: { index: false } };
  const title = `${e.name}${e.country ? ` from ${e.country}` : ""} signed Osama's logbook`;
  const description = e.note.length > 160 ? `${e.note.slice(0, 157)}...` : e.note;
  const image = `https://www.osamadives.com/api/logbook/${e.id}/card`;
  return {
    title: `${title} | OsamaDives`,
    description,
    alternates: { canonical: `https://www.osamadives.com/logbook/${e.id}` },
    openGraph: { title, description, images: [{ url: image, width: 1080, height: 1920 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function EntryPage({ params }: { params: { id: string } }) {
  const e = await approved(params.id);
  if (!e) notFound();
  const site = siteInfo(e.site);
  return (
    <>
      <header className="lb-top">
        <Link href="/" className="lb-brand">Osama<span>Dives</span></Link>
        <Link href="/logbook#sign" className="lb-btn">Add your page</Link>
      </header>
      <section className="lb-hero" style={{ minHeight: "auto", paddingBottom: "2rem" }}>
        <div className="lb-hero__inner">
          <span className="lb-mono lb-rise">Dive log · {site.label}</span>
          <h1 className="lb-h2 lb-rise">One page from my logbook.</h1>
        </div>
      </section>
      <section className="lb-wall">
        <div className="lb-wall__inner">
          <PageCard entry={e} number={1} variant="single" />
          <p className="lb-stand" style={{ margin: "2.4rem auto 0", textAlign: "center", color: "var(--ink-soft)" }}>
            <Link href="/logbook" style={{ color: "var(--reef)" }}>Read the whole book</Link>
            {" · "}
            <Link href="/logbook#sign" style={{ color: "var(--reef)" }}>Add your page</Link>
          </p>
        </div>
      </section>
    </>
  );
}
