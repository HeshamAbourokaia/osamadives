"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP } from "@/lib/contact";

// The coastline, laid flat for a phone: Taba on the left, Ras Mohammed on the right,
// one stop per page, the page you are on lit. Lives at the top of the drawer.
const STOPS = [
  { href: "/", label: "Home", at: 0.05 },
  { href: "/dive-sites", label: "Sites", at: 0.2 },
  { href: "/blog", label: "Journal", at: 0.35 },
  { href: "/gallery", label: "Gallery", at: 0.5, town: "Dahab" },
  { href: "/review", label: "Reviews", at: 0.65 },
  { href: "/featured/chatgpt", label: "Featured", at: 0.8 },
  { href: WHATSAPP, label: "Contact", at: 0.95 },
];
// The same shore as the side rail, turned on its side: x along the coast, y the bends.
const COAST = "M6 30 C30 24 52 22 78 27 C96 31 106 38 124 33 C142 28 160 20 186 22 C210 24 224 36 246 36 C270 36 290 24 314 24 C338 24 356 32 376 26 C390 22 402 16 414 12";

export default function ShoreStrip({ onPick }: { onPick?: () => void }) {
  const path = usePathname() || "/";
  const activeIndex = Math.max(0, STOPS.findIndex((s) => s.href !== "/" && !s.href.startsWith("http") && path.startsWith(s.href)));
  return (
    <nav className="shore" aria-label="Pages of the site, along the Sinai shore">
      <svg viewBox="0 0 420 48" className="shore__coast" aria-hidden="true">
        <path d={COAST} fill="none" stroke="rgba(63,209,190,0.3)" strokeWidth="1.4" strokeLinecap="round" />
        <path d={COAST} fill="none" stroke="#3fd1be" strokeWidth="1.8" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - STOPS[activeIndex].at} className="shore__drawn" />
      </svg>
      <div className="shore__stops">
        {STOPS.map((s, i) => {
          const ext = s.href.startsWith("http");
          return (
            <a key={s.href} href={s.href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined} onClick={onPick}
              className={`shore__stop${i === activeIndex ? " is-active" : ""}${i < activeIndex ? " is-reached" : ""}`} style={{ left: `${s.at * 100}%` }} aria-current={i === activeIndex ? "page" : undefined}>
              <i aria-hidden="true" />
              <span>{s.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
