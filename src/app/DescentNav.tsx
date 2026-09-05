"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "/dive-sites", label: "Sites" },
  { href: "/blog", label: "Journal" },
  { href: "/gallery", label: "Gallery" },
  { href: "/review", label: "Reviews" },
  { href: "/featured/chatgpt", label: "Featured" },
];

interface Props {
  whatsapp: string;
}

// The brand at the top left, the links along the top on a desktop, and on a phone a
// single button that opens a full sheet. One hand, sun on the screen: big targets.
export default function DescentNav({ whatsapp }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

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
        aria-expanded={open}
        aria-controls="navsheet"
        aria-label={open ? "Close the menu" : "Open the menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {open ? (
        <div className="navsheet" id="navsheet" role="dialog" aria-modal="true" aria-label="Menu" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <nav aria-label="Site, on a phone">
            <a href="/" onClick={() => setOpen(false)}>Home</a>
            {LINKS.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="navsheet__wa">Message Osama on WhatsApp</a>
          </nav>
          <p className="navsheet__foot mono">OsamaDives · Dahab, South Sinai · since 1983</p>
        </div>
      ) : null}
    </>
  );
}
