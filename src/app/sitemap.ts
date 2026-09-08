import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";
import { diveSites } from "@/lib/dive-sites";

const BASE = "https://www.osamadives.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/diving-with-osama`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dive-sites`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/featured/chatgpt`, lastModified: new Date("2026-04-30"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const blog: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const sites: MetadataRoute.Sitemap = diveSites.map((s) => ({
    url: `${BASE}/dive-sites/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...sites, ...blog];
}
