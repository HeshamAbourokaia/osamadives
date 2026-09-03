import type { Metadata } from "next";
import Link from "next/link";

// The address printed on Osama's card. It has to be a real page, not a redirect:
// WhatsApp, Instagram and iMessage read the tags below to build the tappable picture
// card, and a bare redirect gives them nothing to read. People are sent on immediately.
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
    images: [{ url: IMAGE, width: 1200, height: 630, alt: "Write me a review. Osama Dives, Dahab, since 1983." }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [IMAGE] },
};

export default function ReviewLanding() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${FORM}`} />
      </head>
      <body style={{ margin: 0, background: "#eaf4f1", color: "#171208", fontFamily: "system-ui, sans-serif" }}>
        <script
          dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(FORM)});` }}
        />
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ display: "grid", gap: "1rem", justifyItems: "center" }}>
            <img src="/brand/stamp-512.png" alt="" width={88} height={88} />
            <p style={{ margin: 0, fontSize: "1.1rem" }}>Opening the review form...</p>
            <Link href={FORM} style={{ color: "#0d7d70", fontWeight: 700 }}>
              Tap here if it does not open
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
