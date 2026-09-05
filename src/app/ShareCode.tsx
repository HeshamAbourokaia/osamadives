"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import qrcode from "qrcode-generator";

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
    const qr = qrcode(0, "H");
    qr.addData(url);
    qr.make();
    const n = qr.getModuleCount();
    const runs: string[] = [];
    for (let r = 0; r < n; r++) {
      let c = 0;
      while (c < n) {
        if (qr.isDark(r, c)) {
          const start = c;
          while (c < n && qr.isDark(r, c)) c++;
          runs.push(`M${start + 2} ${r + 2}h${c - start}v1h-${c - start}z`);
        } else c++;
      }
    }
    return { size: n + 4, d: runs.join(""), url };
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
        <a className="sharecode__wa" href={`https://wa.me/?text=${encodeURIComponent(`https://www.osamadives.com${target}`)}`} target="_blank" rel="noopener noreferrer">Or send it by WhatsApp</a>
      </figcaption>
    </figure>
  );
}
