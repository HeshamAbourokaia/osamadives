import type { MetadataRoute } from "next";

/** Keep it on your phone: the site as an app on the home screen, the seal as its icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OsamaDives",
    short_name: "OsamaDives",
    description: "Osama, PADI Master Scuba Diver Trainer in Dahab, South Sinai. Dive sites, courses, the journal and the book of reviews.",
    start_url: "/?source=home",
    display: "standalone",
    background_color: "#061420",
    theme_color: "#061420",
    lang: "en",
    icons: [
      { src: "/brand/stamp-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/stamp-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
