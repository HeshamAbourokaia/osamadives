import type { Metadata } from "next";
import Link from "next/link";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import LogbookForm from "./LogbookForm";
import PageCard from "./PageCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sign my logbook | OsamaDives, Dahab",
  description:
    "Every diver keeps a logbook. This one belongs to Osama, PADI Master Scuba Diver Trainer in Dahab, and its pages are written by the people he took into the water. Add yours.",
  alternates: { canonical: "https://www.osamadives.com/logbook" },
  openGraph: {
    title: "Sign my logbook | OsamaDives",
    description: "Pages written by the divers Osama took into the Red Sea. Add yours.",
    url: "https://www.osamadives.com/logbook",
  },
};

const WHATSAPP = "https://wa.me/201090208050?text=" + encodeURIComponent("Hi Osama! I would love to chat about diving in Dahab.");

async function approvedEntries(): Promise<LogbookEntry[]> {
  try {
    return await getStore().list({ status: "approved" });
  } catch (e) {
    console.error("logbook list failed", e);
    return [];
  }
}

export default async function LogbookPage() {
  const entries = await approvedEntries();
  const total = entries.length;
  const firstYear = total ? new Date(entries[total - 1].createdAt).getFullYear() : new Date().getFullYear();

  return (
    <>
      <header className="lb-top">
        <Link href="/" className="lb-brand">Osama<span>Dives</span></Link>
        <a href="#sign" className="lb-btn">Add your page</a>
      </header>

      <section className="lb-hero">
        <span className="lb-hero__year">1983</span>
        <div className="lb-hero__inner">
          <span className="lb-mono lb-rise">Dive log · Dahab, South Sinai · kept since 1983</span>
          <h1 className="lb-h1 lb-rise">Sign my logbook.</h1>
          <p className="lb-stand lb-hero__stand lb-rise">
            Every diver keeps a logbook. This one is mine, and the pages are written by the people I took into the water.
            A first breath, a deep one, a day you will not forget. Add yours.
          </p>
          <div className="lb-hero__row lb-rise">
            <a href="#sign" className="lb-btn">Add your page</a>
            <span className="lb-mono lb-hero__count">
              {total === 0 ? "The first page is yours" : `${total} ${total === 1 ? "page" : "pages"} · since ${firstYear}`}
            </span>
          </div>
          <div className="lb-rule" aria-hidden="true" />
        </div>
      </section>

      <section className="lb-wall" id="pages">
        <div className="lb-wall__inner">
          <div className="lb-wall__head">
            <span className="lb-mono">The pages</span>
            <h2 className="lb-h2">Written by the people I took into the water.</h2>
            <p className="lb-stand">Each one is read and signed by me before it goes in the book. Real names, real dives, their own words.</p>
          </div>
          {total === 0 ? (
            <div className="lb-empty">
              <span className="lb-mono">Entry 001</span>
              <h3 className="lb-h2">The first page is yours.</h3>
              <a href="#sign" className="lb-btn lb-btn--paper">Write it</a>
            </div>
          ) : (
            <div className="lb-grid">
              {entries.map((entry, i) => (
                <PageCard key={entry.id} entry={entry} number={total - i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="lb-sign" id="sign">
        <div className="lb-sign__inner">
          <LogbookForm nextNumber={total + 1} />
        </div>
      </section>

      <footer className="lb-foot lb-mono">
        <span>OsamaDives · family on this shore since 1983</span>
        <span>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp Osama</a>
          {" · "}
          <Link href="/">Home</Link>
        </span>
      </footer>
    </>
  );
}
