"use client";

import { WHATSAPP } from "@/lib/contact";

/**
 * The one thing to do, and nothing else beside it. The coastline on the edge carries
 * where to go, so the foot of the screen is free for the single action the whole site
 * leads to. WhatsApp because it is what people in Egypt actually answer.
 */
export default function MessageButton() {
  return (
    <a className="msgbtn" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Message Osama on WhatsApp" data-analytics-event="whatsapp_click" data-analytics-category="conversion" data-analytics-label="Message Osama">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm0 1.8a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 0 1 12 4.8zm-2.6 3.6c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.5-1.8-.1-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.3 0-.5l-.8-1.8c-.2-.4-.4-.4-.6-.4h-.4z" /></svg>
      <span>Message</span>
    </a>
  );
}
