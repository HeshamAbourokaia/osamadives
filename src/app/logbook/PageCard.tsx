import Image from "next/image";
import { entryNumber, formatDivedOn } from "@/lib/logbook/format";
import { siteInfo } from "@/lib/logbook/sites";
import type { LogbookEntry } from "@/lib/logbook/types";
import Stamp from "./Stamp";

export type PageData = Pick<LogbookEntry, "id" | "name" | "country" | "site" | "divedOn" | "course" | "stamp" | "note" | "photoUrl" | "createdAt">;

interface Props {
  entry: PageData;
  number: number;
  variant?: "wall" | "single" | "preview";
  inkStamp?: boolean;
}

export default function PageCard({ entry, number, variant = "wall", inkStamp = false }: Props) {
  const site = siteInfo(entry.site);
  const when = formatDivedOn(entry.divedOn) || new Date(entry.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const isLocalPreview = Boolean(entry.photoUrl && /^(blob:|data:)/.test(entry.photoUrl));
  return (
    <article className={`lb-page${variant === "single" ? " lb-page--single" : ""}`}>
      <div className="lb-page__meta lb-mono">
        <span>Entry {entryNumber(number)}</span>
        <span>{when}</span>
      </div>
      <Stamp stamp={entry.stamp} uid={`${variant}-${entry.id}`} className={inkStamp ? "lb-stamp--ink" : undefined} />
      <h3 className="lb-page__name">{entry.name || "Your name"}</h3>
      {entry.country ? <span className="lb-page__from lb-mono">from {entry.country}</span> : null}
      <span className="lb-page__site lb-mono">
        {site.label}
        {site.depth ? ` · ${site.depth}` : ""}
      </span>
      {entry.photoUrl ? (
        <div className="lb-page__photo">
          <Image src={entry.photoUrl} alt="" fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw" className="lb-page__img" unoptimized={isLocalPreview} />
        </div>
      ) : null}
      <p className="lb-page__note">{entry.note || "Your note to Osama will sit here, in your words."}</p>
      <div className="lb-page__foot lb-mono">
        <span>{entry.course ? `${entry.course} · ` : ""}Stamped by Osama</span>
        <span>Dahab</span>
      </div>
    </article>
  );
}
