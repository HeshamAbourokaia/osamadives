"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
}

export default function ScrollProgress({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(section.id);
            }
          });
        },
        { threshold: 0.4, rootMargin: "-20% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <nav
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-3"
      aria-label="Page section progress"
    >
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group relative flex items-center justify-end h-3"
          aria-label={s.label}
        >
          <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap bg-abyss/80 px-2 py-1 rounded">
            {s.label}
          </span>
          <span
            className={`w-2 h-2 rounded-full border transition-all duration-300 ${
              active === s.id
                ? "bg-sun-glint border-sun-glint scale-125"
                : "bg-transparent border-white/40 group-hover:border-white"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
