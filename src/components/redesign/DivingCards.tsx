"use client";

import Image from "next/image";
import * as gtag from "@/lib/gtag";

interface Card {
  title: string;
  sub: string;
  desc: string;
  img: string;
  context: string;
}

const cards: Card[] = [
  {
    title: "Intro Dive",
    sub: "Never tried it. Try it.",
    desc: "Half a day. A pool, then the sea. No certification, just a first breath underwater.",
    img: "/images/FB_IMG_1621238990084.jpg",
    context: "I want to try an Intro Dive in Dahab.",
  },
  {
    title: "Open Water",
    sub: "The certification.",
    desc: "Three to four days. You leave able to dive anywhere in the world to 18m.",
    img: "/images/OsamaDives_PADI_Open_Water.jpeg",
    context: "I want to do my Open Water with you.",
  },
  {
    title: "Advanced",
    sub: "Go deeper, learn five specialties.",
    desc: "Two days, five adventure dives, opens you up to 30m and night diving.",
    img: "/images/Advanced Open Water.jpeg",
    context: "I want to do my Advanced course with you.",
  },
  {
    title: "Rescue",
    sub: "The most rewarding course.",
    desc: "Four days. The course that turns you into a buddy worth diving with.",
    img: "/images/OsamaDives_Rescue_Diver_Course.png",
    context: "I want to do my Rescue Diver course with you.",
  },
  {
    title: "Divemaster",
    sub: "The first pro step.",
    desc: "Several weeks alongside me. The start of a career, if you want one.",
    img: "/images/OsamaDives_CPR Training Simulation.png",
    context: "I am thinking about Divemaster. Tell me more.",
  },
  {
    title: "Specialties",
    sub: "Sidemount, nitrox, deep, night.",
    desc: "Pick what calls you. We tailor it to the reefs you want to dive.",
    img: "/images/Osama7Tanks.jpeg",
    context: "I want to do a specialty course. Tell me more.",
  },
  {
    title: "Blue Hole guided",
    sub: "For certified divers only.",
    desc: "Twenty logged dives required. The pilgrimage every diver eventually makes.",
    img: "/images/OsamaDives_The_Blue_Hole.jpeg",
    context: "I want to dive the Blue Hole with you.",
  },
  {
    title: "Ras Abu Galum",
    sub: "A camel safari, then a dive.",
    desc: "A full day. Bedouin camp lunch. Reef untouched by road traffic.",
    img: "/images/Camels.jpeg",
    context: "I want to do the Ras Abu Galum safari.",
  },
];

function whatsappLink(context: string) {
  return `https://wa.me/201090208050?text=${encodeURIComponent("Hi Osama! " + context)}`;
}

export default function DivingCards() {
  return (
    <section
      id="diving"
      className="bg-bone py-24 sm:py-32 px-5 sm:px-10 scroll-mt-20"
    >
      <div className="max-w-editorial mx-auto">
        <p className="label-eyebrow text-reef mb-4">03. Diving with me</p>
        <h2 className="font-display text-abyss text-4xl sm:text-6xl md:text-7xl leading-[1.02] mb-10 max-w-3xl">
          Eight ways to spend
          <br />
          a day in the water.
        </h2>

        {/* Compliance explainer */}
        <div className="bg-abyss/5 border-l-2 border-reef p-7 mb-16 max-w-3xl">
          <p className="label-eyebrow text-reef mb-3">How this works</p>
          <p className="text-abyss/80 leading-relaxed">
            Egypt&apos;s diving regulations mean I don&apos;t run my own dive
            centre. I work with established CDWS-registered centres in Dahab.
            When you message me, we figure out which experience suits you. I
            introduce you to the right centre, and I dive alongside you as your
            instructor from start to finish.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
          {cards.map((card) => (
            <article key={card.title} className="group">
              <div className="relative aspect-[4/5] mb-5 overflow-hidden rounded-sm bg-abyss/10">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="label-eyebrow text-abyss/50 mb-2">{card.sub}</p>
              <h3 className="font-display text-2xl sm:text-3xl text-abyss mb-3">
                {card.title}
              </h3>
              <p className="text-abyss/75 leading-relaxed mb-5">{card.desc}</p>
              <a
                href={whatsappLink(card.context)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  gtag.event({
                    action: "whatsapp_click",
                    category: "conversion",
                    label: `card_${card.title}`,
                  })
                }
                className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-reef hover:text-abyss transition-colors"
              >
                Chat about this
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </article>
          ))}
        </div>

        {/* Safety note */}
        <div className="mt-20 pt-10 border-t border-abyss/15 max-w-3xl">
          <p className="label-eyebrow text-abyss/50 mb-4">Before you ask</p>
          <ul className="space-y-3 text-abyss/80 leading-relaxed">
            <li>Anyone diving the Blue Hole must have at least an Open Water certification.</li>
            <li>The Arch is strictly for Technical Divers.</li>
            <li>Recreational diving here is limited to a maximum depth of 40 meters.</li>
            <li>Twenty logged dives required for the Blue Hole guided dive. I am strict on the twenty-dive prerequisite.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
