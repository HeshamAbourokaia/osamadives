"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#story", label: "Story" },
  { href: "/#reefs", label: "The Reefs" },
  { href: "/#diving", label: "Diving" },
  { href: "/blog", label: "Journal" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#say-hello", label: "Say hello" },
];

interface TopNavProps {
  /** Force the solid abyss background regardless of scroll (for inner pages with no hero overlap). */
  forceSolid?: boolean;
}

export default function TopNav({ forceSolid = false }: TopNavProps) {
  const [scrolled, setScrolled] = useState(forceSolid);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (forceSolid) return;
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceSolid]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          scrolled || forceSolid
            ? "bg-abyss/95 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-baseline gap-2 text-white"
            aria-label="OsamaDives home"
          >
            <span className="font-display text-xl tracking-tight">OsamaDives</span>
            <span className="hidden sm:inline text-white/55 text-xs font-mono">
              Dahab, since 1983
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-9 text-sm text-white/85">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 -mr-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-abyss md:hidden flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex-1 flex flex-col justify-center px-8 gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-white hover:text-sun-glint transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="px-8 pb-10 text-white/50 text-xs font-mono">
            OsamaDives. Dahab, since 1983.
          </div>
        </div>
      )}
    </>
  );
}
