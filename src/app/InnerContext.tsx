import { WHATSAPP } from "@/lib/contact";

export default function InnerContext() {
  return (
    <nav className="inner-context" aria-label="Site context">
      <a href="/" className="inner-context__brand">OsamaDives</a>
      <span aria-hidden="true">·</span>
      <span>Dahab, South Sinai</span>
      <a
        className="inner-context__cta"
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event="whatsapp_click"
        data-analytics-category="conversion"
        data-analytics-label="Message Osama from page context"
      >
        Message Osama
      </a>
    </nav>
  );
}
