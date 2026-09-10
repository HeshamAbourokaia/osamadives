"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, event as trackEvent } from "@/lib/gtag";

function readableLabel(element: HTMLElement) {
  const explicit = element.dataset.analyticsLabel;
  if (explicit) return explicit.slice(0, 80);
  const text = (element.textContent || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 80);
}

function SiteAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const seen = new Set<string>();
    const onClick = (click: MouseEvent) => {
      const target = click.target;
      if (!(target instanceof Element)) return;
      const element = target.closest<HTMLElement>("a, button");
      if (!element) return;

      let action = element.dataset.analyticsEvent;
      let category = element.dataset.analyticsCategory || "engagement";
      const href = element instanceof HTMLAnchorElement ? element.href : "";
      if (!action && (element.classList.contains("msgbtn") || href.includes("wa.me"))) {
        action = "whatsapp_click";
        category = "conversion";
      } else if (!action && element.matches(".cta, [data-analytics-cta]")) {
        action = "cta_clicked";
        category = "conversion";
      } else if (!action && element.matches(".topnav a, .tail-foot a, .siderail__stop")) {
        action = "navigation_clicked";
        category = "navigation";
      }
      if (!action) return;
      const label = readableLabel(element);
      const key = `${action}:${category}:${label}`;
      if (element.dataset.analyticsOnce === "true" && seen.has(key)) return;
      seen.add(key);
      trackEvent({ action, category, label });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const fired = new Set<number>();
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const depth = Math.round((window.scrollY / max) * 100);
      for (const threshold of [25, 50, 75, 90]) {
        if (depth >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackEvent({ action: "scroll_depth", category: "engagement", label: `${threshold}%` });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).id;
        if (!id || seen.has(id)) continue;
        seen.add(id);
        trackEvent({ action: "section_viewed", category: "engagement", label: id });
      }
    }, { threshold: 0.5 });
    document.querySelectorAll<HTMLElement>("section[id$='-act'], section#stories").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

export default function SiteAnalytics() {
  return (
    <Suspense fallback={null}>
      <SiteAnalyticsTracker />
    </Suspense>
  );
}
