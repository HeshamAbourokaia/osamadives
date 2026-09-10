"use client";

import ShareButton from "./ShareButton";
import PickButton from "./PickButton";
import SiteFit from "./SiteFit";
import type { Pick } from "@/lib/picks";
import type { SiteLevel } from "@/lib/level";

export interface PhoneCardItem { href: string; title: string; kicker: string; text: string; image: string; alt: string; pick?: Pick; level?: SiteLevel }

const SITE = "https://www.osamadives.com";

/**
 * A list on a phone should look like a list. Every item is on the page at once,
 * one under the other, so five dive sites read as five dive sites and nothing waits
 * behind a gesture nobody was told about. The card itself is the link, through a
 * stretched overlay, which leaves the share button free to be its own control
 * rather than an anchor inside an anchor.
 */
export default function PhoneCards({ items, label }: { items: PhoneCardItem[]; label: string }) {
  return (
    <ul className="pcards only-mobile" aria-label={label}>
      {items.map((it, i) => (
        <li className="pcard" key={it.href}>
          <img className="pcard__img" src={it.image} alt={it.alt} loading={i < 2 ? "eager" : "lazy"} decoding="async" />
          <div className="pcard__body">
            <span className="pcard__kicker">{it.kicker}</span>
            {it.level ? <SiteFit site={it.level} /> : null}
            <h2 className="pcard__title"><a className="pcard__link" href={it.href}>{it.title}</a></h2>
            <p className="pcard__text">{it.text}</p>
            {it.pick ? <PickButton {...it.pick} /> : null}
          </div>
          <ShareButton className="pcard__share" url={`${SITE}${it.href}`} title={it.title} label="Share" />
        </li>
      ))}
    </ul>
  );
}
