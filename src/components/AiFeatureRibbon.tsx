"use client";

import Link from "next/link";
import * as gtag from "@/lib/gtag";

type Variant = "hero" | "inline";

interface Props {
  variant?: Variant;
}

export default function AiFeatureRibbon({ variant = "hero" }: Props) {
  const baseClasses =
    "group inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full backdrop-blur-md border transition-colors";

  const variantClasses =
    variant === "hero"
      ? "bg-white/10 hover:bg-white/15 border-white/20 text-white/90"
      : "bg-black/5 hover:bg-black/10 border-black/10 text-[#3a3f33]";

  const dotColor = "bg-[#10A37F]";
  const chevronColor =
    variant === "hero" ? "text-white/60" : "text-black/40";

  return (
    <Link
      href="/featured/chatgpt"
      className={`${baseClasses} ${variantClasses}`}
      aria-label="Read how a diver found Osama through ChatGPT"
      onClick={() =>
        gtag.event({
          action: "cta_click",
          category: "engagement",
          label: "hero_chatgpt_ribbon",
        })
      }
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-60`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`}
        />
      </span>
      <span className="text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap">
        <span className="sm:hidden">Found through ChatGPT</span>
        <span className="hidden sm:inline">
          A diver found us through ChatGPT
        </span>
      </span>
      <span
        className={`text-base leading-none transition-transform group-hover:translate-x-0.5 ${chevronColor}`}
        aria-hidden="true"
      >
        ›
      </span>
    </Link>
  );
}
