"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "/diving-with-osama", label: "Teaching" },
  { href: "/dive-sites", label: "Sites" },
  { href: "/blog", label: "Journal" },
  { href: "/gallery", label: "Gallery" },
  { href: "/review", label: "Reviews" },
  { href: "/featured/chatgpt", label: "Featured" },
];

/**
 * The brand at the top left and the links along the top on a desk. On a phone, a
 * capsule at the top right, the way the big phone apps carry it: Menu opens the same
 * coast the handle on the edge does, Home goes home. The handle on the edge still says
 * where you are and still opens the coast; the capsule is the door everybody sees.
 */
export default function DescentNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = (event: Event) => setOpen((event as CustomEvent<boolean>).detail);
    window.addEventListener("od:rail-state", sync);
    return () => window.removeEventListener("od:rail-state", sync);
  }, []);
  return (
    <>
      <div className="topbar" aria-hidden="true" />
      <a className="brand" href="/" aria-label="OsamaDives, home">Osama<span style={{ opacity: 0.75 }}>Dives</span></a>
      <nav className="topnav" aria-label="Site">
        {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>
      <div className="capsule" role="group" aria-label="Menu and home">
        <button
          type="button"
          className="capsule__btn capsule__menu"
          aria-label={open ? "Close the menu" : "Open the menu"}
          aria-expanded={open}
          aria-controls="od-coast-menu"
          onClick={() => window.dispatchEvent(new Event("od:rail"))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          <span>Menu</span>
        </button>
        <a
          className="capsule__btn capsule__home"
          href="/"
          aria-label="Home"
          onClick={(e) => { if (window.location.pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8M5 10v10h14V10" /></svg>
        </a>
      </div>
    </>
  );
}
