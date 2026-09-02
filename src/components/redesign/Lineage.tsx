"use client";

import Image from "next/image";
import { useState } from "react";

type YearKey = "1983" | "2011" | "today";

const years: Record<YearKey, { caption: string; img: string; alt: string }> = {
  "1983": {
    caption:
      "My family settled in Dahab and opened Shark Restaurant. The kitchen has not closed since.",
    img: "/images/dahab-1987-pioneer-family.jpeg",
    alt: "Hesham family in early Dahab, 1980s",
  },
  "2011": {
    caption: "I started diving. The sea took me in.",
    img: "/images/OsamaDives_PADI_Open_Water.jpeg",
    alt: "Osama in his early diving days",
  },
  today: {
    caption: "Master Scuba Diver Trainer. Still learning from the reef.",
    img: "/images/OsamaDives_Him_Self.jpeg",
    alt: "Osama today, PADI Master Scuba Diver Trainer",
  },
};

const order: YearKey[] = ["1983", "2011", "today"];

const credentials = [
  "PADI MSDT",
  "CDWS registered",
  "1,000+ Blue Hole dives",
  "Diving since 2011",
  "4th family in Dahab since 1983",
];

export default function Lineage() {
  const [active, setActive] = useState<YearKey>("today");
  const current = years[active];

  return (
    <section
      id="story"
      className="bg-bone py-24 sm:py-32 px-5 sm:px-10 scroll-mt-20"
    >
      <div className="max-w-editorial mx-auto">
        <p className="reveal label-eyebrow text-reef mb-4">01. Lineage</p>
        <h2
          className="reveal font-display text-abyss text-4xl sm:text-6xl md:text-7xl leading-[1.02] mb-16 max-w-3xl"
          style={{ ["--reveal-delay" as string]: "90ms" }}
        >
          Forty years on one
          <br />
          stretch of coast.
        </h2>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Portrait */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-abyss/10 rounded-sm">
            <Image
              key={active}
              src={current.img}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-700"
            />
          </div>

          {/* Timeline + text */}
          <div className="flex flex-col">
            <div className="flex gap-6 mb-10 border-b border-abyss/15 pb-6">
              {order.map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`font-mono text-sm pb-2 -mb-[1.625rem] border-b-2 transition-colors ${
                    active === key
                      ? "border-reef text-abyss"
                      : "border-transparent text-abyss/50 hover:text-abyss"
                  }`}
                  aria-pressed={active === key}
                >
                  {key}
                </button>
              ))}
            </div>

            <p className="font-display text-2xl sm:text-3xl text-abyss leading-snug mb-10">
              {current.caption}
            </p>

            <div className="border-t border-abyss/15 pt-8">
              <p className="label-eyebrow text-abyss/55 mb-4">Credentials</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-mono text-abyss/80">
                {credentials.map((c, i) => (
                  <li key={c} className="flex items-center gap-3">
                    {i > 0 && <span className="text-abyss/30">/</span>}
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
