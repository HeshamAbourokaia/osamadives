"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Element) => unknown; instances: unknown[] };
  }
}

const ENGINE_SRC = "/descent/scrollcraft.js";

export default function DescentBoot() {
  useEffect(() => {
    let cancelled = false;
    const boot = () => {
      if (cancelled || !window.ScrollCraft) return;
      // On a phone a rail that pans on the vertical wheel is a puzzle: you cannot go
      // back to a card, and the page stops moving while the cards do. There the three
      // rails become ordinary acts and the cards are swiped sideways, natively.
      if (matchMedia("(max-width: 860px)").matches) {
        document.querySelectorAll<HTMLElement>("section:has(.js-rail)").forEach((sec) => {
          sec.setAttribute("data-sc-act", "flow");
          sec.removeAttribute("data-sc-span");
          sec.style.removeProperty("--sc-span");
          sec.classList.add("rail-swipe");
        });
      }
      window.ScrollCraft.mount(document.body);
    };
    if (window.ScrollCraft) {
      boot();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${ENGINE_SRC}"]`);
      const script = existing ?? document.createElement("script");
      script.addEventListener("load", boot, { once: true });
      if (!existing) {
        script.src = ENGINE_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
    }
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
