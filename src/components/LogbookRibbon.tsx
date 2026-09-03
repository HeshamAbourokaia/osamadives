"use client";

import Link from "next/link";
import * as gtag from "@/lib/gtag";

type Variant = "hero" | "inline";

interface Props {
  variant?: Variant;
}

// Hero pill that opens the logbook. Replaces the read-only reviews pill.
export default function LogbookRibbon({ variant = "hero" }: Props) {
  const baseClasses =
    "group inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full backdrop-blur-md border transition-colors";
  const variantClasses =
    variant === "hero"
      ? "bg-white/10 hover:bg-white/15 border-white/20 text-white/90"
      : "bg-black/5 hover:bg-black/10 border-black/10 text-[#3a3f33]";
  const chevronColor = variant === "hero" ? "text-white/60" : "text-black/40";

  return (
    <Link
      href="/logbook"
      className={`${baseClasses} ${variantClasses}`}
      aria-label="Write Osama a review"
      onClick={() =>
        gtag.event({
          action: "cta_click",
          category: "engagement",
          label: "hero_logbook_ribbon",
        })
      }
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8.5" stroke="#3FD1BE" strokeWidth="1.8" />
        <circle cx="10" cy="10" r="4.5" stroke="#3FD1BE" strokeWidth="1.2" />
      </svg>
      <span className="text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap">
        Write me a review
      </span>
      <span className={`text-base leading-none transition-transform group-hover:translate-x-0.5 ${chevronColor}`} aria-hidden="true">
        ›
      </span>
    </Link>
  );
}
