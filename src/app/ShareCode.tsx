"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { qrPath } from "./qr-svg";
import ShareButton from "./ShareButton";

/**
 * "Show a friend": a code for the page being looked at, so the person next to you
 * points a camera at the screen and gets the same page, no typing. It goes through
 * /qr so the scan is counted with the card's, labelled as a screen.
 */
export default function ShareCode({ path, caption = "Point a camera at this to open this page on another phone." }: { path?: string; caption?: string }) {
  const here = usePathname() || "/";
  const target = path ?? here;
  const { size, d, url } = useMemo(() => {
    const url = `https://www.osamadives.com/qr?s=screen&to=${target}`;
    return { ...qrPath(url), url };
  }, [target]);

  return (
    <figure className="sharecode">
      <a className="sharecode__code" href={url} aria-label="Open this page through the counted link">
        <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Code for osamadives.com${target}`} shapeRendering="crispEdges">
          <rect width={size} height={size} fill="#FFFDF8" />
          <path d={d} fill="#171208" />
        </svg>
        <img src="/brand/stamp-512.png" alt="" className="sharecode__stamp" width={64} height={64} />
      </a>
      <figcaption>
        <strong>Show a friend.</strong> {caption}
        <ShareButton className="sharecode__wa" url={`https://www.osamadives.com${target}`} label="Or send it to someone" fallbackLabel="Or send it by WhatsApp" />
      </figcaption>
    </figure>
  );
}
