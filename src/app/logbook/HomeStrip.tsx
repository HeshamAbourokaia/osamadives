import Link from "next/link";
import { Archivo, Caveat, IBM_Plex_Mono } from "next/font/google";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import PageCard from "./PageCard";
import WeddingPage from "./WeddingPage";
import MemoryBook from "./MemoryBook";
import "./logbook.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--lb-display", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--lb-mono", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--lb-hand", display: "swap" });

// The homepage's window into the logbook: the three newest approved pages.
export default async function HomeStrip() {
  let entries: LogbookEntry[] = [];
  let total = 0;
  try {
    const all = await getStore().list({ status: "approved" });
    total = all.length;
    entries = [...all.filter((e) => e.featured), ...all.filter((e) => !e.featured)].slice(0, 10);
  } catch (e) {
    console.error("logbook strip failed", e);
  }

  return (
    <section id="stories" className={`lb ${archivo.variable} ${plex.variable} ${hand.variable}`} style={{ minHeight: "auto" }}>
      <div className="lb-wall" style={{ paddingTop: "clamp(3.5rem, 7vw, 6rem)", paddingBottom: "clamp(3.5rem, 7vw, 6rem)" }}>
        <div className="lb-wall__inner">
          <div className="lb-wall__head">
            <span className="lb-mono">Reviews{total ? ` · ${total}` : ""}</span>
            <h2 className="lb-h2">Written by the people I took into the water.</h2>
            <p className="lb-stand">Reviews written by the people I took into the water. Every one becomes a page in my logbook, signed by me.</p>
          </div>
          <MemoryBook
            pages={[
              { hard: true, caption: "The book of reviews", node: (
                <div className="book__cover" key="cover">
                  <img className="book__cover-bg" src="/logbook/dahab-camels.webp" alt="" />
                  <div className="book__cover-ink">
                    <img src="/brand/stamp-512.png" alt="" width={110} height={110} />
                    <span className="lb-mono">Reviews{total ? ` · ${total}` : ""}</span>
                    <h3 className="lb-h2">The book of the people I took into the water.</h3>
                    <p className="lb-stand">Drag a corner to turn.</p>
                  </div>
                </div>
              ) },
              { caption: "Entry 000 · Hesham & Sophie · the underwater wedding", href: "/review#pages", node: <WeddingPage variant="wall" key="wedding" /> },
              ...entries.map((e, i) => ({ caption: `Entry ${String(total - i).padStart(3, "0")} · ${e.name}${e.country ? ` · ${e.country}` : ""}`, href: `/review/${e.id}`, node: <PageCard key={e.id} entry={e} number={total - i} /> })),
              { hard: true, caption: "The next page is yours", node: (
                <div className="book__cover book__cover--back" key="back">
                  <img className="book__cover-bg" src="/logbook/dahab-lagoon.webp" alt="" />
                  <div className="book__cover-ink">
                    <span className="lb-mono">A blank page</span>
                    <h3 className="lb-h2">The next review is yours.</h3>
                    <Link href="/review#sign" className="lb-btn lb-btn--paper">Write me a review</Link>
                  </div>
                </div>
              ) },
            ]}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "2.4rem" }}>
            <Link href="/review#pages" className="lb-btn lb-btn--paper">Read all the reviews</Link>
            <Link href="/review#sign" className="lb-btn lb-btn--quiet" style={{ color: "var(--ink)", borderColor: "rgba(23, 18, 8, 0.3)" }}>Write a review</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
