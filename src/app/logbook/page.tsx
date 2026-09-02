import type { Metadata } from "next";
import Link from "next/link";
import { storageReady } from "@/lib/logbook/config";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import LogbookForm from "./LogbookForm";
import PageCard from "./PageCard";
import WeddingPage from "./WeddingPage";

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
  const open = storageReady();
  const entries = open ? await approvedEntries() : [];
  const total = entries.length;
  const countries = new Set(entries.map((e) => e.country.trim().toLowerCase()).filter(Boolean)).size;
  const firstYear = total ? new Date(entries[total - 1].createdAt).getFullYear() : new Date().getFullYear();
  // While the book is closed every "add" button goes to WhatsApp instead of an empty form.
  const addHref = open ? "#sign" : WHATSAPP;
  const addLabel = open ? "Add your page" : "Message Osama";
  const countLine = total === 0
    ? "The first page is yours"
    : `${total} ${total === 1 ? "page" : "pages"}${countries > 1 ? ` from ${countries} countries` : ""} · since ${firstYear}`;

  return (
    <>
      <header className="lb-top">
        <Link href="/" className="lb-brand">Osama<span>Dives</span></Link>
        <a href={addHref} className="lb-btn">{addLabel}</a>
      </header>

      <section className="lb-hero">
        <svg className="lb-hero__year" viewBox="0 0 1000 260" aria-hidden="true" focusable="false">
          <text x="1000" y="236" textAnchor="end">1983</text>
        </svg>
        <div className="lb-hero__inner">
          <span className="lb-mono lb-rise">Dive log · Dahab, South Sinai · kept since 1983</span>
          <h1 className="lb-h1 lb-rise">Sign my logbook.</h1>
          <p className="lb-stand lb-hero__stand lb-rise">
            Every diver keeps a logbook. This one is mine, and the pages are written by the people I took into the water.
            A first breath, a deep one, a day you will not forget. Add yours.
          </p>
          <div className="lb-hero__row lb-rise">
            <a href={addHref} className="lb-btn">{addLabel}</a>
            <span className="lb-mono lb-hero__count">{countLine}</span>
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
          <div className="lb-featured">
            <span className="lb-mono">The first page</span>
            <WeddingPage />
          </div>
          {entries.some((e) => e.featured) ? (
            <div className="lb-featured">
              <span className="lb-mono">Page of the month</span>
              <PageCard entry={entries.find((e) => e.featured)!} number={total - entries.findIndex((e) => e.featured)} variant="single" />
            </div>
          ) : null}
          {total === 0 ? (
            <div className="lb-empty">
              <span className="lb-mono">Entry 001</span>
              <h3 className="lb-h2">The next page is yours.</h3>
              <a href={addHref} className="lb-btn lb-btn--paper">{open ? "Write it" : "Message Osama"}</a>
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
          {open ? (
            <LogbookForm nextNumber={total + 1} />
          ) : (
            <div className="lb-sign__head">
              <span className="lb-mono">A blank page</span>
              <h2 className="lb-h2">The book opens this week.</h2>
              <p className="lb-stand">I am still setting up the pages. For now, send me your note on WhatsApp and I will keep it for the first page.</p>
              <div><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="lb-btn">Message Osama</a></div>
            </div>
          )}
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
