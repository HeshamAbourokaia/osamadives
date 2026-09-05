import type { Metadata, Viewport } from "next";
import BackToPlace from "@/components/BackToPlace";
import Link from "next/link";
import { storageReady } from "@/lib/logbook/config";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import LogbookForm from "./LogbookForm";
import PageCard from "./PageCard";
import ReviewWall from "./ReviewWall";
import WeddingPage from "./WeddingPage";

export const revalidate = 60;

// The page is light on purpose. Without this, Android browsers with "dark mode for web
// pages" switched on repaint the lagoon as a dark olive and nothing the reader does changes it.
export const viewport: Viewport = { colorScheme: "only light", themeColor: "#e6f6f3" };

export const metadata: Metadata = {
  title: "Write me a review | OsamaDives, Dahab",
  description:
    "Reviews of diving with Osama, PADI Master Scuba Diver Trainer in Dahab, written by the people he took into the water. He reads and signs every review before it goes on the site. Write yours.",
  alternates: { canonical: "https://www.osamadives.com/review" },
  openGraph: {
    title: "Write me a review | OsamaDives",
    description: "Reviews written by the divers Osama took into the Red Sea. Write yours.",
    url: "https://www.osamadives.com/review",
    images: [{ url: "https://www.osamadives.com/og/review-card.png", width: 1200, height: 630, alt: "Write me a review. Osama Dives, Dahab." }],
  },
  twitter: { card: "summary_large_image", title: "Write me a review | OsamaDives", images: ["https://www.osamadives.com/og/review-card.png"] },
};

const WHATSAPP = "https://wa.me/201090208050?text=" + encodeURIComponent("Hi Osama! I would love to chat about diving in Dahab.");

const WALL_PAGE = 24;

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
  const addLabel = open ? "Write a review" : "Message Osama";
  // The wedding page and the page of the month sit above the wall. They step aside while a reader filters.
  const featured = (
    <>
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
    </>
  );
  const countLine = total === 0
    ? "The first review is yours"
    : `${total} ${total === 1 ? "review" : "reviews"}${countries > 1 ? ` from ${countries} countries` : ""} · since ${firstYear}`;

  return (
    <>
      <header className="lb-top lb-top--bar">
        <Link href="/" className="lb-back" aria-label="Back to the Osama Dives website">
          <span aria-hidden="true">&larr;</span>
          <img src="/brand/stamp-512.png" alt="" width={30} height={30} />
          <span className="lb-back__text">osamadives<span>.com</span></span>
        </Link>
        <a href={addHref} className="lb-btn">{addLabel}</a>
      </header>

      <section className="lb-hero">
        <svg className="lb-hero__year" viewBox="0 0 1000 260" aria-hidden="true" focusable="false">
          <text x="1000" y="236" textAnchor="end">1983</text>
        </svg>
        <div className="lb-hero__inner">
          <img src="/brand/stamp-512.png" alt="" width={190} height={190} className="lb-hero__seal lb-rise" />
          <span className="lb-mono lb-rise">Reviews · Dahab, South Sinai · diving since 1983</span>
          <h1 className="lb-h1 lb-rise">Write me a review.</h1>
          <p className="lb-stand lb-hero__stand lb-rise">
            Your review goes on this page in your own words, read and signed by me.
            A first breath, a deep one, a day you will not forget. Write yours.
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
            <span className="lb-mono">The reviews</span>
            <h2 className="lb-h2">Written by the people I took into the water.</h2>
            <p className="lb-stand">Each one is read and signed by me before it goes in the book. Real names, real dives, their own words.</p>
          </div>
          {total === 0 ? (
            <>
              {featured}
              <div className="lb-empty">
                <span className="lb-mono">Entry 001</span>
                <h3 className="lb-h2">The next review is yours.</h3>
                <a href={addHref} className="lb-btn lb-btn--paper">{open ? "Write it" : "Message Osama"}</a>
              </div>
            </>
          ) : (
            // The search and filter bar renders first, then the featured pages, then the wall.
            <ReviewWall initial={entries.slice(0, WALL_PAGE)} total={total} topNumber={total}>
              {featured}
            </ReviewWall>
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
      <BackToPlace />
    </>
  );
}
