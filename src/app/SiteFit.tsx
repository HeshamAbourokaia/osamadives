"use client";

import { useEffect, useState } from "react";
import { onLevel, readLevel, siteFit, type Level, type SiteLevel } from "@/lib/level";

/** What this site says to you, at the level you set. */
export default function SiteFit({ site }: { site: SiteLevel }) {
  const [level, setLevel] = useState<Level | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setLevel(readLevel()); setReady(true); return onLevel(setLevel); }, []);
  if (!ready) return null;
  const fit = siteFit(site, level);
  return <span className={`fit fit--${fit.tone}`}>{fit.text}</span>;
}
