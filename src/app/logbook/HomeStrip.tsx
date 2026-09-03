import Link from "next/link";
import { Archivo, Caveat, IBM_Plex_Mono } from "next/font/google";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import PageCard from "./PageCard";
import WeddingPage from "./WeddingPage";
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
    entries = [...all.filter((e) => e.featured), ...all.filter((e) => !e.featured)].slice(0, 3);
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
          <div className="lb-grid">
            <WeddingPage variant="wall" />
            {entries.slice(0, 2).map((e, i) => (
              <PageCard key={e.id} entry={e} number={total - i} />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "2.4rem" }}>
            <Link href="/logbook#sign" className="lb-btn lb-btn--paper">Write a review</Link>
            <Link href="/logbook#pages" className="lb-btn lb-btn--quiet" style={{ color: "var(--ink)", borderColor: "rgba(23, 18, 8, 0.3)" }}>Read all the reviews</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
