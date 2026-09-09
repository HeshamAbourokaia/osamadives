"use client";

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
  return (
    <>
      <div className="topbar" aria-hidden="true" />
      <a className="brand" href="/" aria-label="OsamaDives, home">Osama<span style={{ opacity: 0.75 }}>Dives</span></a>
      <nav className="topnav" aria-label="Site">
        {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>
      <button
        type="button"
        className="navbtn"
        aria-label="Menu"
        onClick={() => window.dispatchEvent(new Event("od:rail"))}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </>
  );
}
