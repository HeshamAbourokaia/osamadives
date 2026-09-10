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
 * The brand at the top left and the links along the top on a desk. On a phone, one
 * button: the menu sign everybody already knows, and it opens the same coast the
 * handle on the edge does, so there is one menu with two doors and nothing that lives
 * behind only one of them. The sheet it used to open held nothing the foot of every
 * page does not hold as well.
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
      <button
        type="button"
        className={`navbtn${open ? " is-open" : ""}`}
        aria-label={open ? "Close menu" : "Menu"}
        aria-expanded={open}
        aria-controls="od-coast-menu"
        onClick={() => window.dispatchEvent(new Event("od:rail"))}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </>
  );
}
