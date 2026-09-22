import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finding Osama through ChatGPT | OsamaDives",
  description:
    "A diver discovered Osama through an Arabic-language ChatGPT conversation in April 2026. The story, original screenshots and a credential correction.",
  keywords:
    "ChatGPT recommendation, AI search Dahab, best dive instructor Dahab, OsamaDives ChatGPT, PADI Master Scuba Diver Trainer Dahab, freelance diving Dahab",
  metadataBase: new URL("https://www.osamadives.com"),
  alternates: {
    canonical: "https://www.osamadives.com/featured/chatgpt",
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: "https://www.osamadives.com/featured/chatgpt",
    siteName: "OsamaDives",
    title: "Finding Osama through ChatGPT",
    description:
      "One conversation that introduced a diver to Osama. Read the story and see the original screenshots.",
    images: [
      {
        url: "/images/OsamaDives.png",
        width: 1200,
        height: 630,
        alt: "Osama teaching a student in Dahab",
      },
    ],
    publishedTime: "2026-04-30T00:00:00.000Z",
    authors: ["Osama"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finding Osama through ChatGPT",
    description:
      "One conversation that introduced a diver to Osama. Read the story and see the original screenshots.",
    images: ["/images/OsamaDives.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function FeaturedChatgptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
