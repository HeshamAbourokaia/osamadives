"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { siteInfo } from "@/lib/logbook/sites";
import { stampInfo } from "@/lib/logbook/stamps";
import PageCard, { type PageData } from "./PageCard";
import ReviewSocial, { deviceId, type SocialData } from "./ReviewSocial";

interface Props {
  initial: PageData[];
  total: number;
  /** Entry number of the newest review, so numbering counts down as we page. */
  topNumber: number;
}

const PAGE = 24;

interface Filters {
  year: string;
  site: string;
  course: string;
}
const NONE: Filters = { year: "", site: "", course: "" };

const yearOf = (e: PageData) => (e.divedOn ? e.divedOn.slice(0, 4) : e.createdAt.slice(0, 4));

function haystack(e: PageData): string {
  return [e.name, e.country, e.note, e.reply ?? "", siteInfo(e.site).label, e.course, ...e.stamps.map((k) => stampInfo(k).label)]
    .join(" ")
    .toLowerCase();
}

// The wall holds one page of reviews and fetches the next on request, so a book with
// hundreds of reviews still opens fast. Searching or filtering pulls the whole approved
// list once and works on it here, so the count and the cards change as you type.
export default function ReviewWall({ initial, total, topNumber }: Props) {
  const [entries, setEntries] = useState<PageData[]>(initial);
  const [everything, setEverything] = useState<PageData[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [social, setSocial] = useState<Record<string, SocialData>>({});
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");
  const [filters, setFilters] = useState<Filters>(NONE);
  const [panel, setPanel] = useState(false);
  const [shownFiltered, setShownFiltered] = useState(PAGE);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const fetched = useRef<Set<string>>(new Set());

  const filtering = query.trim() !== "" || filters.year !== "" || filters.site !== "" || filters.course !== "";

  // A short pause after typing before the list changes, so each keystroke does not re-sort the wall.
  useEffect(() => {
    const t = setTimeout(() => setQuery(typed), 150);
    return () => clearTimeout(t);
  }, [typed]);

  // The first time a reader filters, or opens the filter panel, fetch the whole approved list.
  useEffect(() => {
    if (!(filtering || panel) || everything !== null || total <= entries.length) return;
    let live = true;
    fetch("/api/logbook/list?all=1")
      .then((r) => r.json())
      .then((d) => { if (live && Array.isArray(d.entries)) setEverything(d.entries); })
      .catch(() => { /* filtering still runs over what is loaded */ });
    return () => { live = false; };
  }, [filtering, panel, everything, total, entries.length]);

  const complete = everything ?? (entries.length >= total ? entries : null);
  const source = complete ?? entries;

  // Counts and this device's own reactions for cards that have not asked yet, one request per batch.
  const visibleIds = useMemo(() => {
    if (!filtering) return entries.map((e) => e.id);
    return source.map((e) => e.id);
  }, [filtering, entries, source]);
  useEffect(() => {
    const need = visibleIds.filter((id) => !fetched.current.has(id)).slice(0, 60);
    if (!need.length) return;
    need.forEach((id) => fetched.current.add(id));
    const device = deviceId();
    fetch(`/api/logbook/social?ids=${need.join(",")}&device=${encodeURIComponent(device)}`)
      .then((r) => r.json())
      .then((d) => {
        setSocial((prev) => {
          const next = { ...prev };
          for (const id of need) {
            next[id] = { counts: d.reactions?.[id] ?? {}, mine: d.mine?.[id] ?? [] };
          }
          return next;
        });
      })
      .catch(() => { need.forEach((id) => fetched.current.delete(id)); });
  }, [visibleIds]);

  const more = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/logbook/list?offset=${entries.length}&limit=${PAGE}`);
      const data = await res.json();
      if (Array.isArray(data.entries) && data.entries.length) {
        setEntries((prev) => [...prev, ...data.entries.filter((e: PageData) => !prev.some((p) => p.id === e.id))]);
      }
    } catch {
      /* the reader keeps what is already on screen */
    } finally {
      setBusy(false);
    }
  }, [entries.length]);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  // Which years, sites and courses exist in the book. Only those become chips.
  const facets = useMemo(() => {
    const years = new Set<string>();
    const sites = new Set<string>();
    const courses = new Set<string>();
    for (const e of source) {
      years.add(yearOf(e));
      sites.add(e.site);
      if (e.course) courses.add(e.course);
    }
    return {
      years: [...years].sort().reverse(),
      sites: [...sites].map((k) => ({ key: k, label: siteInfo(k as PageData["site"]).label })),
      courses: [...courses],
    };
  }, [source]);

  const matches = useMemo(() => {
    if (!filtering) return source;
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return source.filter((e) => {
      if (filters.year && yearOf(e) !== filters.year) return false;
      if (filters.site && e.site !== filters.site) return false;
      if (filters.course && e.course !== filters.course) return false;
      if (!words.length) return true;
      const hay = haystack(e);
      return words.every((w) => hay.includes(w));
    });
  }, [filtering, source, query, filters]);

  // Entry numbers count down from the newest. In a filtered view each card keeps its real number.
  const numberOf = useMemo(() => {
    const map = new Map<string, number>();
    const list = complete ?? entries;
    list.forEach((e, i) => map.set(e.id, topNumber - i));
    return map;
  }, [complete, entries, topNumber]);

  const list = filtering ? matches.slice(0, shownFiltered) : entries;
  const shown = list.length;
  const left = filtering ? Math.max(0, matches.length - shown) : Math.max(0, total - shown);
  const activeCount = (filters.year ? 1 : 0) + (filters.site ? 1 : 0) + (filters.course ? 1 : 0);

  const clearAll = () => {
    setTyped("");
    setQuery("");
    setFilters(NONE);
    setShownFiltered(PAGE);
  };
  const pick = (key: keyof Filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: f[key] === value ? "" : value }));
    setShownFiltered(PAGE);
  };

  const chipGroup = (label: string, key: keyof Filters, options: { key: string; label: string }[]) =>
    options.length ? (
      <div className="lb-tools__group" role="group" aria-label={label}>
        <span className="lb-mono">{label}</span>
        <div className="lb-chips">
          {options.map((o) => (
            <button key={o.key} type="button" className="lb-chip lb-chip--small" aria-pressed={filters[key] === o.key} onClick={() => pick(key, o.key)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  const openOne = list[open ?? -1];

  return (
    <>
      <div className={`lb-tools${panel ? " has-panel" : ""}`} role="search">
        <div className="lb-tools__bar">
          <input
            type="search"
            className="lb-tools__search"
            value={typed}
            onChange={(e) => { setTyped(e.target.value); setShownFiltered(PAGE); }}
            placeholder="Search a name or a word"
            aria-label="Search the reviews"
            enterKeyHint="search"
          />
          <button
            type="button"
            className={`lb-btn lb-btn--paper lb-tools__toggle${panel ? " is-open" : ""}`}
            aria-expanded={panel}
            aria-controls="lb-filters"
            onClick={() => setPanel((p) => !p)}
          >
            Filters{activeCount ? <span className="lb-tools__badge">{activeCount}</span> : null}
          </button>
        </div>
        {panel ? (
          <div className="lb-tools__panel" id="lb-filters">
            {chipGroup("Year", "year", facets.years.map((y) => ({ key: y, label: y })))}
            {chipGroup("Dive site", "site", facets.sites)}
            {chipGroup("Course", "course", facets.courses.map((c) => ({ key: c, label: c })))}
            {complete === null && total > entries.length ? <span className="lb-mono lb-tools__hint">Reading the rest of the book...</span> : null}
          </div>
        ) : null}
        {filtering || panel ? (
          <div className="lb-tools__count" aria-live="polite">
            <span className="lb-mono">
              {filtering ? `${matches.length} of ${total} ${total === 1 ? "review" : "reviews"} match` : `${total} reviews`}
            </span>
            {filtering ? (
              <button type="button" className="lb-tools__clear" onClick={clearAll}>Clear all</button>
            ) : null}
          </div>
        ) : null}
      </div>

      {filtering && matches.length === 0 ? (
        <div className="lb-empty lb-empty--search">
          <span className="lb-mono">No match</span>
          <h3 className="lb-h2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Nobody wrote that yet.</h3>
          <button type="button" className="lb-btn lb-btn--paper" onClick={clearAll}>Show every review</button>
        </div>
      ) : null}

      <div className="lb-grid">
        {list.map((entry, i) => (
          <div key={entry.id} className="lb-card">
            <button
              type="button"
              className="lb-open"
              aria-label={`Read the review from ${entry.name}${entry.country ? ` from ${entry.country}` : ""}`}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
            >
              <PageCard entry={entry} number={numberOf.get(entry.id) ?? topNumber - i} />
            </button>
            {social[entry.id] ? <ReviewSocial id={entry.id} name={entry.name} initial={social[entry.id]} /> : <div className="lb-social lb-social--wait" aria-hidden="true" />}
          </div>
        ))}
      </div>

      {left > 0 ? (
        <div className="lb-more">
          <button
            type="button"
            className="lb-btn lb-btn--paper"
            onClick={filtering ? () => setShownFiltered((n) => n + PAGE) : more}
            disabled={busy}
          >
            {busy ? "Reading..." : `Show ${Math.min(PAGE, left)} more`}
          </button>
          <span className="lb-mono">{shown} of {filtering ? matches.length : total} reviews</span>
        </div>
      ) : total > 0 && !filtering ? (
        <div className="lb-more"><span className="lb-mono">All {total} reviews, every one signed</span></div>
      ) : null}

      {open !== null && openOne ? (
        <div className="lb-modal" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div
            className="lb-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Review from ${openOne.name}`}
            tabIndex={-1}
            ref={dialog}
          >
            <button type="button" className="lb-modal__close" onClick={close} aria-label="Close this review">&times;</button>
            <PageCard entry={openOne} number={numberOf.get(openOne.id) ?? topNumber - open} variant="single" />
          </div>
        </div>
      ) : null}
    </>
  );
}
