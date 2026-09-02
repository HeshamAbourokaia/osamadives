"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Reef {
  key: string;
  slug: string | null;
  name: string;
  depth: string;
  feature: string;
  quote: string;
  img: string;
  /** Position on the schematic map (percent from top/left). */
  x: number;
  y: number;
}

const reefs: Reef[] = [
  {
    key: "blueHole",
    slug: "blue-hole-dahab",
    name: "Blue Hole",
    depth: "100m+",
    feature: "The Arch at 56m, tech only.",
    quote: "It holds more moods than the sea has colors.",
    img: "/images/OsamaDives_The_Blue_Hole.jpeg",
    x: 78,
    y: 22,
  },
  {
    key: "canyon",
    slug: "the-canyon-dahab",
    name: "The Canyon",
    depth: "54m",
    feature: "Cathedral-like rift swim.",
    quote: "You drop in through a crack and the world goes quiet.",
    img: "/images/OsamDives_The_Canyon.jpg",
    x: 70,
    y: 30,
  },
  {
    key: "lighthouse",
    slug: "lighthouse-reef-dahab",
    name: "Lighthouse",
    depth: "30m",
    feature: "House reef, training site.",
    quote: "Where I taught my first ten students.",
    img: "/images/FB_IMG_1621238990084.jpg",
    x: 42,
    y: 58,
  },
  {
    key: "eelGarden",
    slug: "eel-garden-dahab",
    name: "Eel Garden",
    depth: "28m",
    feature: "Garden of swaying eels.",
    quote: "A meadow that breathes.",
    img: "/images/FB_IMG_1638331910256.jpg",
    x: 56,
    y: 44,
  },
  {
    key: "threePools",
    slug: "three-pools-dahab",
    name: "Three Pools",
    depth: "12m",
    feature: "Shallow coral playground.",
    quote: "My favourite place to take nervous first-timers.",
    img: "/images/FB_IMG_1625154352007.jpg",
    x: 62,
    y: 38,
  },
  {
    key: "rasAbu",
    slug: null,
    name: "Ras Abu Galum",
    depth: "40m",
    feature: "Camel safari approach.",
    quote: "We get there by camel. It still feels like 1983.",
    img: "/images/Camels.jpeg",
    x: 86,
    y: 12,
  },
];

export default function ReefsMap() {
  const [active, setActive] = useState<string>(reefs[0].key);
  const current = reefs.find((r) => r.key === active) ?? reefs[0];

  return (
    <section
      id="reefs"
      className="bg-abyss text-white py-24 sm:py-32 px-5 sm:px-10 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-editorial mx-auto">
        <p className="label-eyebrow text-sun-glint mb-4">02. The Reefs</p>
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] mb-6 max-w-3xl">
          Six places I keep
          <br />
          returning to.
        </h2>
        <p className="text-white/65 max-w-xl text-lg leading-relaxed mb-16">
          Tap a reef to read what it means to me. They sit along a short stretch
          of South Sinai coast, north of Dahab town.
        </p>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Schematic map */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-abyss to-[#06141d] rounded-lg overflow-hidden border border-white/8">
              {/* Schematic shore line, illustrated with SVG */}
              <svg
                viewBox="0 0 800 600"
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#0d9488" stopOpacity="0.06" />
                    <stop offset="1" stopColor="#0d9488" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Sea body */}
                <rect width="800" height="600" fill="url(#sea)" />
                {/* Sinai coast outline (stylised) */}
                <path
                  d="M 760 0 L 700 80 L 640 160 L 560 220 L 480 270 L 380 320 L 280 360 L 200 420 L 140 500 L 80 600 L 800 600 Z"
                  fill="#e8dfd0"
                  fillOpacity="0.06"
                  stroke="#e8dfd0"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
                {/* Bathymetric hint lines */}
                {[0.15, 0.3, 0.5, 0.7].map((o, i) => (
                  <path
                    key={i}
                    d={`M ${760 - i * 30} ${0 + i * 25} L ${700 - i * 25} ${80 + i * 22} L ${560 - i * 18} ${220 + i * 18} L ${280 - i * 12} ${360 + i * 16} L ${80 - i * 8} ${600}`}
                    fill="none"
                    stroke="#0d9488"
                    strokeOpacity={o * 0.25}
                    strokeWidth="0.6"
                  />
                ))}
              </svg>

              {/* Dahab label */}
              <span className="absolute left-[18%] bottom-[18%] label-eyebrow text-white/45">
                Dahab
              </span>
              <span className="absolute right-[6%] top-[5%] label-eyebrow text-white/45">
                North
              </span>

              {/* Hotspots */}
              {reefs.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setActive(r.key)}
                  onMouseEnter={() => setActive(r.key)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  aria-label={`Reveal ${r.name}`}
                  aria-pressed={active === r.key}
                >
                  <span
                    className={`block w-3 h-3 rounded-full border transition-all ${
                      active === r.key
                        ? "bg-sun-glint border-sun-glint scale-125 shadow-[0_0_20px_rgba(245,210,138,0.6)]"
                        : "bg-reef/40 border-reef group-hover:bg-reef group-hover:scale-110"
                    }`}
                  />
                  <span
                    className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-mono uppercase tracking-widest transition-colors ${
                      active === r.key ? "text-white" : "text-white/55 group-hover:text-white"
                    }`}
                  >
                    {r.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail card */}
          <div className="lg:col-span-2">
            <article className="bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
              <div className="relative aspect-[16/10]">
                <Image
                  key={current.img}
                  src={current.img}
                  alt={current.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss to-transparent" />
              </div>
              <div className="p-7">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-display text-3xl text-white">{current.name}</h3>
                  <span className="font-mono text-sun-glint text-sm">{current.depth}</span>
                </div>
                <p className="text-white/70 text-sm mb-5 font-mono">
                  {current.feature}
                </p>
                <p className="font-display text-xl text-white/90 leading-snug mb-6">
                  &ldquo;{current.quote}&rdquo;
                </p>
                {current.slug && (
                  <Link
                    href={`/dive-sites/${current.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-sun-glint hover:text-white transition-colors font-mono uppercase tracking-widest"
                  >
                    Read the full site
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
