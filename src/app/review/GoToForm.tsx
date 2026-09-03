"use client";

import { useEffect } from "react";

// People are sent to the form the moment the page loads. Crawlers do not run scripts,
// so WhatsApp, Instagram and iMessage stay on this page long enough to read its tags
// and build the picture card.
export default function GoToForm({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}
