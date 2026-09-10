import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "./components/GoogleAnalytics";
import SiteAnalytics from "./components/SiteAnalytics";
import { diveSites } from "@/lib/dive-sites";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OsamaDives | PADI Diving Instructor in Dahab, Egypt - Since 1983",
  description:
    "Osama is a PADI Master Scuba Diver Trainer in Dahab, Egypt. Pioneer family since 1983. Experience the Red Sea with an Ambassador of Dahab.",
  keywords:
    "scuba diving Dahab, diving instructor Egypt, PADI instructor Dahab, Blue Hole diving, diving in Egypt, Red Sea diving, Dahab diving guide, local diving expert Dahab, Ambassador of Dahab, diving since 1983, Sinai diving, South Sinai diving, technical diving Dahab, sidemount Dahab, IANTD instructor Egypt, dive sites Dahab, Canyon dive Dahab, night diving Dahab, snorkeling Dahab, Egypt scuba holiday, Dahab dive trip, Red Sea Sinai, PADI Master Scuba Diver Trainer Dahab, Egypt diving holiday",
  authors: [{ name: "Osama" }],
  creator: "Osama",
  publisher: "OsamaDives",
  metadataBase: new URL("https://www.osamadives.com"),
  alternates: {
    canonical: "https://www.osamadives.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.osamadives.com",
    siteName: "OsamaDives",
    title: "OsamaDives | PADI Diving Instructor in Dahab, Egypt - Since 1983",
    description:
      "Osama is a PADI Master Scuba Diver Trainer in Dahab, Egypt. Pioneer family since 1983. Experience the Red Sea with an Ambassador of Dahab.",
    images: [
      {
        url: "/images/OsamaDives.png",
        width: 1200,
        height: 630,
        alt: "OsamaDives - PADI Diving Instructor in Dahab, Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OsamaDives | PADI Diving Instructor in Dahab, Egypt - Since 1983",
    description:
      "Osama is a PADI Master Scuba Diver Trainer in Dahab, Egypt. Pioneer family since 1983. Experience the Red Sea with an Ambassador of Dahab.",
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

// Structured Data (JSON-LD) for SEO - Person schema (individual, not a business)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.osamadives.com/#website",
      url: "https://www.osamadives.com",
      name: "OsamaDives",
      description:
        "Osama is a PADI Master Scuba Diver Trainer in Dahab, Egypt. Pioneer family since 1983. Experience the Red Sea with an Ambassador of Dahab.",
    },
    {
      "@type": "Person",
      "@id": "https://www.osamadives.com/#person",
      name: "Osama",
      jobTitle: "PADI Master Scuba Diver Trainer",
      description:
        "Ambassador of Dahab and PADI Master Scuba Diver Trainer from a pioneer diving family since 1983. Experience the Red Sea with a local expert.",
      url: "https://www.osamadives.com",
      image: "https://www.osamadives.com/images/OsamaDives.png",
      telephone: "+201090208050",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dahab",
        addressRegion: "South Sinai",
        addressCountry: "EG",
      },
      sameAs: [
        "https://facebook.com/osamasharks",
        "https://instagram.com/osama_mohamed_hassan",
      ],
      knowsAbout: [
        "Scuba Diving",
        "PADI Certification",
        "Technical Diving",
        "Rescue Diving",
        "Blue Hole Diving",
        "Red Sea Marine Life",
        "Dahab Dive Sites",
      ],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          name: "PADI Master Scuba Diver Trainer",
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          name: "IANTD Technical Diving Instructor",
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          name: "CDWS Professional ID Card",
        },
      ],
      award:
        "Named #1 freelance dive instructor in Dahab by ChatGPT (April 2026)",
      subjectOf: {
        "@type": "Article",
        "@id": "https://www.osamadives.com/featured/chatgpt#article",
        url: "https://www.osamadives.com/featured/chatgpt",
        name: "Featured by ChatGPT - top dive instructor in Dahab",
        datePublished: "2026-04-30",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.osamadives.com/#service",
      name: "OsamaDives",
      url: "https://www.osamadives.com",
      description:
        "Personal dive guiding and scuba instruction in Dahab, arranged through CDWS-registered dive centres.",
      image: "https://www.osamadives.com/images/OsamaDives.png",
      provider: { "@id": "https://www.osamadives.com/#person" },
      areaServed: {
        "@type": "Place",
        name: "Dahab, South Sinai, Egypt",
      },
      serviceType: ["Scuba diving instruction", "Dive guiding", "PADI courses"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dahab",
        addressRegion: "South Sinai",
        addressCountry: "EG",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+201090208050",
        availableLanguage: ["English", "Arabic"],
      },
      sameAs: [
        "https://facebook.com/osamasharks",
        "https://instagram.com/osama_mohamed_hassan",
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://www.osamadives.com/#dive-sites",
      name: "Dahab dive sites guided by OsamaDives",
      itemListElement: diveSites.map((site, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: site.name,
        url: `https://www.osamadives.com/dive-sites/${site.slug}`,
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <SiteAnalytics />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
