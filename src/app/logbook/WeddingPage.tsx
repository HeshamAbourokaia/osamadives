import Stamp from "./Stamp";

const FILM_URL = "https://www.facebook.com/reel/10156259145348778";

// The first page in the book, kept in code so it needs no database: the day Osama
// married his brother underwater. Film by Daniel Cavero and Planet Divers.
export default function WeddingPage({ variant = "single" }: { variant?: "single" | "wall" }) {
  return (
    <article className={`lb-page${variant === "single" ? " lb-page--single" : ""}`}>
      <div className="lb-page__meta lb-mono">
        <span>Entry 000</span>
        <span>The underwater wedding</span>
      </div>
      <Stamp stamp="family-shore" uid={`wedding-${variant}`} />
      <h3 className="lb-page__name">Hesham &amp; Sophie</h3>
      <span className="lb-page__from lb-mono">from Melbourne · Osama&apos;s brother</span>
      <span className="lb-page__site lb-mono">Lighthouse Reef · married at depth</span>
      <div className="lb-page__photo lb-page__video">
        <video src="/logbook/wedding-60.mp4" poster="/logbook/wedding-poster.jpg" controls playsInline preload="metadata" />
      </div>
      <p className="lb-page__note">
        I have more dives with Osama than I can count, but the one everyone asks about is the day he married us underwater.
        He organised every part of it, from the plan on the sand to the moment at depth, and made it feel calm. Wherever we
        travel, we tell people we were married under the Red Sea, and that my brother made it happen.
      </p>
      <div className="lb-page__foot lb-mono">
        <span>Stamped by Osama</span>
        <a href={FILM_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--reef)" }}>Watch the whole film</a>
      </div>
    </article>
  );
}
