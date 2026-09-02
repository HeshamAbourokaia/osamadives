"use client";

import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: "Will I dive with you, or a different instructor?",
    a: "Me. From the first briefing to the last dive. I work with CDWS-registered centres for the paperwork, but the diving is always with me.",
  },
  {
    q: "How big are the groups?",
    a: "Small. Usually two to four divers. Never more than what I can keep eyes on.",
  },
  {
    q: "What language do you teach in?",
    a: "English and Arabic, fluently. A little German and Russian.",
  },
  {
    q: "I am nervous about diving, is that okay?",
    a: "Yes. Most of my students are. We start in shallow water, slowly. No one is pushed under.",
  },
  {
    q: "I am already certified, can we just dive together?",
    a: "Of course. Bring your card and log. We will plan something that fits your level.",
  },
];

export default function CommonQuestions() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="questions" className="bg-abyss text-white py-24 sm:py-32 px-5 sm:px-10 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <p className="label-eyebrow text-sun-glint mb-4">05. Common questions</p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-14">
          What people ask before
          <br />
          they message me.
        </h2>

        <div className="border-t border-white/10">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="border-b border-white/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left gap-6"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl sm:text-2xl pr-4">{faq.q}</span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border border-white/30 flex items-center justify-center transition-transform ${
                      isOpen ? "rotate-45 border-sun-glint text-sun-glint" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-7" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-white/70 leading-relaxed text-lg max-w-2xl">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
