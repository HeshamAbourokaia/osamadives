import type { Metadata } from "next";
import Link from "next/link";
import GoToForm from "./GoToForm";

// The address printed on Osama's card. It is a real page, not a redirect: messaging apps
// read the tags below to build the tappable picture card, and a redirect gives them nothing.
const FORM = "/logbook#sign";
const IMAGE = "https://www.osamadives.com/og/review-card.png";
const TITLE = "Write me a review · OsamaDives, Dahab";
const DESC = "Tell Osama how the dive went. He reads every review and signs it himself.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://www.osamadives.com/review" },
  openGraph: {
    type: "website",
    siteName: "OsamaDives",
    title: TITLE,
    description: DESC,
    url: "https://www.osamadives.com/review",
    images: [{ url: IMAGE, width: 1200, height: 630, type: "image/png", alt: "Write me a review. Osama Dives, Dahab, since 1983." }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [IMAGE] },
};

export default function ReviewLanding() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
        background: "#eaf4f1",
        color: "#171208",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <GoToForm to={FORM} />
      <div style={{ display: "grid", gap: "1rem", justifyItems: "center" }}>
        <img src="/brand/stamp-512.png" alt="" width={96} height={96} />
        <p style={{ margin: 0, fontSize: "1.1rem" }}>Opening the review form...</p>
        <Link href={FORM} style={{ color: "#0d7d70", fontWeight: 700 }}>
          Tap here if it does not open
        </Link>
      </div>
    </main>
  );
}
