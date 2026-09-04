"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { siteInfo } from "@/lib/logbook/sites";
import { stampInfo } from "@/lib/logbook/stamps";
import { STAMP_KEYS } from "@/lib/logbook/types";
import PageCard, { type PageData } from "./PageCard";
import ReviewSocial, { deviceId, type SocialData } from "./ReviewSocial";

interface Props {
  initial: PageData[];
  total: number;
  /** Entry number of the newest review, so numbering counts down as we page. */
  topNumber: number;
  /** The featured pages, shown between the filter bar and the wall until a reader filters. */
  children?: React.ReactNode;
}

const PAGE = 24;

interface Filters {
  year: string;
  month: string;
  site: string;
  course: string;
  country: string;
  stamp: string;
  /** "photo", "video" or "reply": only reviews that carry one */
  only: string;
  /** "" newest first, "oldest", or "loved" (most reactions first) */
  order: string;
}
const NONE: Filters = { year: "", month: "", site: "", course: "", country: "", stamp: "", only: "", order: "" };
const FILTER_KEYS = Object.keys(NONE) as (keyof Filters)[];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The month and year the dive happened, or failing that the month the review was written.
const yearOf = (e: PageData) => (e.divedOn ? e.divedOn.slice(0, 4) : e.createdAt.slice(0, 4));
const monthOf = (e: PageData) => (e.divedOn && e.divedOn.length >= 7 ? e.divedOn.slice(5, 7) : e.createdAt.slice(5, 7));
const countryOf = (e: PageData) => e.country.trim().toLowerCase();

const stampIndex = (k: string) => (STAMP_KEYS as readonly string[]).indexOf(k);

function haystack(e: PageData): string {
  return [e.name, e.country, e.note, e.reply ?? "", siteInfo(e.site).label, e.course, ...e.stamps.map((k) => stampInfo(k).label)]
    .join(" ")
    .toLowerCase();
}

// The wall holds one page of reviews and fetches the next on request, so a book with
// hundreds of reviews still opens fast. Searching or filtering pulls the whole approved
// list once and works on it here, so the count and the cards change as you type.
export default function ReviewWall({ initial, total, topNumber, children }: Props) {
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

  const filtering = query.trim() !== "" || FILTER_KEYS.some((k) => filters[k] !== "");

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

  // Which years, months, sites, courses, countries and stamps exist in the book. Only those become chips.
  const facets = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>();
    const sites = new Set<string>();
    const courses = new Set<string>();
    const countries = new Map<string, { label: string; n: number }>();
    const stamps = new Set<string>();
    let photos = 0, videos = 0, replies = 0;
    for (const e of source) {
      if (e.photoUrl) photos++;
      if (e.videoUrl) videos++;
      if (e.reply) replies++;
      years.add(yearOf(e));
      months.add(monthOf(e));
      sites.add(e.site);
      if (e.course) courses.add(e.course);
      const c = countryOf(e);
      if (c) countries.set(c, { label: e.country.trim(), n: (countries.get(c)?.n ?? 0) + 1 });
      for (const k of e.stamps) stamps.add(k);
    }
    return {
      years: [...years].sort().reverse(),
      months: [...months].sort().map((m) => ({ key: m, label: MONTHS[Number(m) - 1] ?? m })),
      sites: [...sites].map((k) => ({ key: k, label: siteInfo(k as PageData["site"]).label })),
      courses: [...courses],
      countries: [...countries.entries()].sort((a, b) => b[1].n - a[1].n || a[1].label.localeCompare(b[1].label)).map(([k, v]) => ({ key: k, label: v.label })),
      stamps: [...stamps].sort((a, b) => stampIndex(a) - stampIndex(b)).map((k) => ({ key: k, label: stampInfo(k as PageData["stamps"][number]).label })),
      photos, videos, replies,
    };
  }, [source]);

  const matches = useMemo(() => {
    if (!filtering) return source;
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const loved = (e: PageData) => Object.values(social[e.id]?.counts ?? {}).reduce((a, b) => a + b, 0);
    const kept = source.filter((e) => {
      if (filters.year && yearOf(e) !== filters.year) return false;
      if (filters.month && monthOf(e) !== filters.month) return false;
      if (filters.site && e.site !== filters.site) return false;
      if (filters.course && e.course !== filters.course) return false;
      if (filters.country && countryOf(e) !== filters.country) return false;
      if (filters.stamp && !e.stamps.includes(filters.stamp as PageData["stamps"][number])) return false;
      if (filters.only === "photo" && !e.photoUrl) return false;
      if (filters.only === "video" && !e.videoUrl) return false;
      if (filters.only === "reply" && !e.reply) return false;
      if (!words.length) return true;
      const hay = haystack(e);
      return words.every((w) => hay.includes(w));
    });
    if (filters.order === "oldest") return [...kept].reverse();
    if (filters.order === "loved") return [...kept].sort((a, b) => loved(b) - loved(a)); // stable: ties stay newest first
    return kept;
  }, [filtering, source, query, filters, social]);

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
  const activeCount = FILTER_KEYS.filter((k) => filters[k] !== "").length;

  const clearAll = () => {
    setTyped("");
    setQuery("");
    setFilters(NONE);
    setShownFiltered(PAGE);
  };

  // One dropdown per facet: on a phone the system picker opens, on a desktop a styled select.
  const dropdown = (label: string, any: string, key: keyof Filters, options: { key: string; label: string }[]) =>
    options.length ? (
      <label className={`lb-tools__field${filters[key] ? " is-set" : ""}`}>
        <span className="lb-mono">{label}</span>
        <select className="lb-tools__select" value={filters[key]} onChange={(e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setShownFiltered(PAGE); }}>
          <option value="">{any}</option>
          {options.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </label>
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
            <svg className="lb-tools__caret" viewBox="0 0 14 9" width="14" height="9" aria-hidden="true" focusable="false">
              <path d="M1 1l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {!panel && !filtering ? (
          <button type="button" className="lb-tools__hintline" onClick={() => setPanel(true)}>
            <span className="lb-mono">Tap Filters for year, month, dive site, country, course, stamp and more</span>
          </button>
        ) : null}
        {panel ? (
          <div className="lb-tools__panel" id="lb-filters">
            <div className="lb-tools__grid">
              {dropdown("Year", "Any year", "year", facets.years.map((y) => ({ key: y, label: y })))}
              {dropdown("Month", "Any month", "month", facets.months)}
              {dropdown("Dive site", "Anywhere", "site", facets.sites)}
              {dropdown("Country", "Any country", "country", facets.countries)}
              {dropdown("Course", "Any course", "course", facets.courses.map((c) => ({ key: c, label: c })))}
              {dropdown("Stamp", "Any stamp", "stamp", facets.stamps)}
              {dropdown("Show only", "Everything", "only", [
                ...(facets.photos ? [{ key: "photo", label: "With a photo" }] : []),
                ...(facets.videos ? [{ key: "video", label: "With a video" }] : []),
                ...(facets.replies ? [{ key: "reply", label: "Osama replied" }] : []),
              ])}
              {dropdown("Order", "Newest first", "order", [{ key: "oldest", label: "Oldest first" }, { key: "loved", label: "Most loved" }])}
            </div>
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

      {!filtering ? children : null}

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
