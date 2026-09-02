"use client";

import * as gtag from "@/lib/gtag";

type Variant = "hero" | "inline";

interface Props {
  variant?: Variant;
}

export default function InstagramRibbon({ variant = "hero" }: Props) {
  const baseClasses =
    "group inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full backdrop-blur-md border transition-colors";

  const variantClasses =
    variant === "hero"
      ? "bg-white/10 hover:bg-white/15 border-white/20 text-white/90"
      : "bg-black/5 hover:bg-black/10 border-black/10 text-[#3a3f33]";

  const chevronColor = variant === "hero" ? "text-white/60" : "text-black/40";

  return (
    <a
      href="#instagram-feed"
      className={`${baseClasses} ${variantClasses}`}
      aria-label="Jump to Osama's latest Instagram posts"
      onClick={() =>
        gtag.event({
          action: "cta_click",
          category: "engagement",
          label: "hero_instagram_ribbon",
        })
      }
    >
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {/* Instagram glyph in a single fill. Gradient isn't supported by SVG fill in this minimal embed,
            so we use a recognisable warm-pink that reads as Instagram on dark hero backgrounds. */}
        <path
          fill="#E1306C"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
      <span className="text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap">
        <span className="sm:hidden">Latest dives</span>
        <span className="hidden sm:inline">Latest dives &middot; @osama_mohamed_hassan</span>
      </span>
      <span
        className={`text-base leading-none transition-transform group-hover:translate-x-0.5 ${chevronColor}`}
        aria-hidden="true"
      >
        ›
      </span>
    </a>
  );
}
