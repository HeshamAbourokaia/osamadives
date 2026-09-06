import { diveSites } from "./dive-sites";
import { galleryPhotos } from "./gallery-config";
import { blogPosts } from "./blog-posts";
import type { LogbookEntry } from "./logbook/types";

export type OrbitKind = "site" | "gallery" | "journal" | "review";

export interface OrbitItem {
  id: string;
  kind: OrbitKind;
  kicker: string;
  title: string;
  meta: string;
  image: string;
  imageAlt: string;
  href: string;
}

// Real Osama photographs already shipped elsewhere on the descent page, reused here
// per site so the ring does not show the same placeholder five times over (the
// dive-sites data file itself only carries one shared image for all five sites).
const SITE_IMAGE: Record<string, { src: string; alt: string }> = {
  "blue-hole-dahab": { src: "/descent/depth-8.webp", alt: "The reef shelf at the edge of the Blue Hole, eight metres down" },
  "the-canyon-dahab": { src: "/images/OsamDives_The_Canyon.jpg", alt: "The Canyon dive site in Dahab, dramatic light through a coral rift" },
  "lighthouse-reef-dahab": { src: "/descent/sea-poster.webp", alt: "A coral-crusted pillar at Lighthouse reef, Dahab" },
  "eel-garden-dahab": { src: "/descent/depth-7.webp", alt: "A turtle over the reef at Om El Seed, close to Eel Garden" },
  "three-pools-dahab": { src: "/descent/arch-lagoon.webp", alt: "The turquoise lagoon at Dahab, close to Three Pools" },
};

function siteOrbitItems(): OrbitItem[] {
  return diveSites.map((site) => {
    const img = SITE_IMAGE[site.slug] ?? { src: site.featuredImage, alt: site.imageAlt };
    return {
      id: `site-${site.slug}`,
      kind: "site",
      kicker: "Dive site",
      title: site.shortName,
      meta: `${site.depthMin}-${site.depthMax} m`,
      image: img.src,
      imageAlt: img.alt,
      href: `/dive-sites/${site.slug}`,
    };
  });
}

const GALLERY_PICKS = ["story-coral-explorer", "story-first-breath", "story-in-my-element"];

function galleryOrbitItems(): OrbitItem[] {
  return GALLERY_PICKS.map((id) => galleryPhotos.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((photo) => ({
      id: `gallery-${photo.id}`,
      kind: "gallery",
      kicker: "Gallery",
      title: photo.title,
      meta: photo.location ?? "Dahab",
      image: photo.src,
      imageAlt: photo.alt,
      href: "/gallery",
    }));
}

function journalOrbitItems(): OrbitItem[] {
  return blogPosts.map((post) => ({
    id: `journal-${post.slug}`,
    kind: "journal",
    kicker: "Journal",
    title: post.title,
    meta: new Date(post.date).getFullYear().toString(),
    image: post.featuredImage,
    imageAlt: post.title,
    href: `/blog/${post.slug}`,
  }));
}

const SITE_LABEL: Record<string, string> = {
  "lighthouse-reef-dahab": "Lighthouse",
  "eel-garden-dahab": "Eel Garden",
  "three-pools-dahab": "Three Pools",
  "the-canyon-dahab": "The Canyon",
  "blue-hole-dahab": "Blue Hole",
  elsewhere: "Dahab",
};

// Real, approved logbook entries only. No invented quotes: if the store is
// empty (nothing approved yet), this returns nothing and the ring simply
// carries fewer cards rather than inventing a reviewer.
export function reviewOrbitItems(entries: LogbookEntry[]): OrbitItem[] {
  return entries.slice(0, 3).map((entry) => ({
    id: `review-${entry.id}`,
    kind: "review",
    kicker: "Review",
    title: entry.name,
    meta: SITE_LABEL[entry.site] ?? "Dahab",
    image: entry.photoUrl ?? "/descent/osama-portrait.webp",
    imageAlt: `${entry.name}'s review of diving with Osama`,
    href: `/review/${entry.id}`,
  }));
}

// Round-robin interleave so the ring reads as one mixed orbit of everything on
// the site rather than four separate blocks of cards.
export function interleaveOrbitItems(groups: OrbitItem[][]): OrbitItem[] {
  const out: OrbitItem[] = [];
  const max = Math.max(0, ...groups.map((g) => g.length));
  for (let i = 0; i < max; i++) {
    for (const g of groups) if (g[i]) out.push(g[i]);
  }
  return out;
}

export function buildOrbitItems(reviews: LogbookEntry[]): OrbitItem[] {
  return interleaveOrbitItems([siteOrbitItems(), journalOrbitItems(), galleryOrbitItems(), reviewOrbitItems(reviews)]);
}
