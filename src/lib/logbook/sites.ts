import { diveSites } from "@/lib/dive-sites";
import type { SiteKey } from "./types";

export interface SiteInfo {
  key: SiteKey;
  label: string;
  depth: string;
  where: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function fromLib(key: SiteKey, where: string): SiteInfo {
  const s = diveSites.find((d) => d.slug === key);
  if (!s) throw new Error(`Unknown dive site slug: ${key}`);
  return {
    key,
    label: s.name.replace(/,\s*Dahab$/, ""),
    depth: `${pad(s.depthMin)}-${s.depthMax} m`,
    where,
  };
}

// Shore order, south to north, matching the dive-site pages.
export const SITES: SiteInfo[] = [
  fromLib("three-pools-dahab", "South of town"),
  fromLib("lighthouse-reef-dahab", "In town"),
  fromLib("eel-garden-dahab", "Town, north end"),
  fromLib("the-canyon-dahab", "North of town"),
  fromLib("blue-hole-dahab", "The famous one"),
  { key: "elsewhere", label: "Somewhere else on the coast", depth: "", where: "Sinai" },
];

export function siteInfo(key: SiteKey): SiteInfo {
  return SITES.find((s) => s.key === key) ?? SITES[SITES.length - 1];
}
