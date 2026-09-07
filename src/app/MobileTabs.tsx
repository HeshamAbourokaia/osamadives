"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP } from "@/lib/contact";

/**
 * The phone's navigation: five tabs in the thumb zone, with Message raised in the
 * middle as the one action the whole site leads to. Hidden on a desk, where the
 * top bar and the coastline carry the same places. Everything else lives in the
 * drawer behind the menu button.
 */
const TABS = [
  { href: "/", label: "Home", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/dive-sites", label: "Sites", icon: "M12 2c3.9 0 7 3.1 7 7 0 5.2-7 13-7 13S5 14.2 5 9c0-3.9 3.1-7 7-7zm0 4.5A2.5 2.5 0 1 0 12 11a2.5 2.5 0 0 0 0-5z" },
  { href: WHATSAPP, label: "Message", icon: "", raised: true },
  { href: "/gallery", label: "Gallery", icon: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2v8l4-4 3 3 3-3 4 4V7H5zm3 1.5A1.5 1.5 0 1 0 8 11.5 1.5 1.5 0 0 0 8 8.5z" },
  { href: "/review", label: "Reviews", icon: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" },
];

export default function MobileTabs() {
  const path = usePathname() || "/";
  const active = (href: string) => (href === "/" ? path === "/" : !href.startsWith("http") && path.startsWith(href));
  return (
    <nav className="tabbar" aria-label="Main, on a phone">
      {TABS.map((t) =>
        t.raised ? (
          <a key={t.label} className="tabbar__wa" href={t.href} target="_blank" rel="noopener noreferrer" aria-label="Message Osama on WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 1.8a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 0 1 12 4.8zm-2.6 3.6c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.6-.4h-.4z" /></svg>
            <span>Message</span>
          </a>
        ) : (
          <a key={t.label} className={`tabbar__tab${active(t.href) ? " is-active" : ""}`} href={t.href} aria-current={active(t.href) ? "page" : undefined}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.icon} /></svg>
            <span>{t.label}</span>
          </a>
        )
      )}
    </nav>
  );
}
