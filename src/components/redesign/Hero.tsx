"use client";

import Image from "next/image";
import * as gtag from "@/lib/gtag";

const WHATSAPP =
  "https://wa.me/201090208050?text=" +
  encodeURIComponent("Hi Osama! I would love to chat about diving in Dahab.");

export default function Hero() {
  return (
    <section id="hero" className="grain relative w-full min-h-screen overflow-hidden bg-abyss">
      {/* Background image with a slow ken-burns drift for a sense of life. */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/OsamaDives.png"
          alt="Osama briefing a student before a dive in Dahab, Red Sea"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center ken-burns"
        />
        {/* Depth grade: darken top for nav legibility, deepen the base for text. */}
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/60 via-abyss/30 to-abyss/95" />
        {/* Caustic light pools drifting across the top, like sun through water. */}
        <div className="caustics absolute inset-0" />
        {/* Subtle side vignette to focus the eye centre. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_60%,transparent_55%,rgba(4,15,23,0.55)_100%)]" />
      </div>

      {/* Status chip - honest availability cue, not a live-video claim. */}
      <div className="absolute top-24 left-5 sm:left-8 z-10 flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-reef opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-reef" />
        </span>
        <span className="label-eyebrow text-white/85">
          Guiding divers &middot; Red Sea
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end px-5 sm:px-10 pb-20 sm:pb-28 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <h1
            className="reveal font-display text-white text-5xl sm:text-7xl md:text-8xl lg:text-[120px] leading-[0.95] tracking-tight mb-8"
          >
            I was raised
            <br />
            on this reef.
          </h1>
          <p
            className="reveal text-white/85 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10"
            style={{ ["--reveal-delay" as string]: "180ms" }}
          >
            I am Osama. PADI Master Scuba Diver Trainer, fourth family in Dahab
            since 1983. I take you under slowly, into a sea I have known my whole
            life.
          </p>
          <div
            className="reveal flex flex-wrap items-center gap-4"
            style={{ ["--reveal-delay" as string]: "280ms" }}
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                gtag.event({
                  action: "whatsapp_click",
                  category: "conversion",
                  label: "hero_primary",
                })
              }
              className="group inline-flex items-center gap-3 bg-reef hover:bg-reef/90 text-white px-7 py-4 rounded-full text-base font-medium shadow-lg shadow-reef/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-reef/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message me on WhatsApp
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white px-2 py-3 text-sm font-mono uppercase tracking-widest border-b border-white/30 hover:border-white/80 transition-colors"
            >
              Scroll to story
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
