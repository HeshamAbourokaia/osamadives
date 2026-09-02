import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import PageCard from "./PageCard";
import "./logbook.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--lb-display", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--lb-mono", display: "swap" });

// The homepage's window into the logbook: the three newest approved pages.
export default async function HomeStrip() {
  let entries: LogbookEntry[] = [];
  let total = 0;
  try {
    const all = await getStore().list({ status: "approved" });
    total = all.length;
    entries = all.slice(0, 3);
  } catch (e) {
    console.error("logbook strip failed", e);
  }

  return (
    <section id="stories" className={`lb ${archivo.variable} ${plex.variable}`} style={{ minHeight: "auto" }}>
      <div className="lb-wall" style={{ paddingTop: "clamp(3.5rem, 7vw, 6rem)", paddingBottom: "clamp(3.5rem, 7vw, 6rem)" }}>
        <div className="lb-wall__inner">
          <div className="lb-wall__head">
            <span className="lb-mono">My logbook{total ? ` · ${total} ${total === 1 ? "page" : "pages"}` : ""}</span>
            <h2 className="lb-h2">Written by the people I took into the water.</h2>
            <p className="lb-stand">Every diver keeps a logbook. This one is mine, and the pages are written by my students. Read them, then add yours.</p>
          </div>
          {entries.length ? (
            <div className="lb-grid">
              {entries.map((e, i) => (
                <PageCard key={e.id} entry={e} number={total - i} />
              ))}
            </div>
          ) : (
            <div className="lb-empty">
              <span className="lb-mono">Entry 001</span>
              <h3 className="lb-h2">The first page is yours.</h3>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "2.4rem" }}>
            <a href="/logbook#sign" className="lb-btn lb-btn--paper">Sign my logbook</a>
            <a href="/logbook" className="lb-btn lb-btn--quiet" style={{ color: "var(--ink)", borderColor: "rgba(23, 18, 8, 0.3)" }}>Read every page</a>
          </div>
        </div>
      </div>
    </section>
  );
}
