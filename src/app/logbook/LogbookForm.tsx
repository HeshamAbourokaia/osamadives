"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITES } from "@/lib/logbook/sites";
import { STAMPS } from "@/lib/logbook/stamps";
import { COURSES, LIMITS, type Course, type SiteKey, type StampKey } from "@/lib/logbook/types";
import { MONTHS } from "@/lib/logbook/format";

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 2011 + 1 }, (_, i) => THIS_YEAR - i);
import PageCard, { type PageData } from "./PageCard";
import Stamp from "./Stamp";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface Props {
  nextNumber: number;
}

type Done = { id: string; cardUrl: string };

export default function LogbookForm({ nextNumber }: Props) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [site, setSite] = useState<SiteKey | "">("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const divedOn = month && year ? `${year}-${month}` : "";
  const [course, setCourse] = useState<Course>("");
  const [stamp, setStamp] = useState<StampKey | "">("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [inked, setInked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

  // Arriving from a dive-site page preselects that site.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("site");
    if (wanted && SITES.some((s) => s.key === wanted)) setSite(wanted as SiteKey);
  }, []);

  const preview: PageData = {
    id: "preview",
    name, country, note, divedOn, course, photoUrl,
    site: site || "lighthouse-reef-dahab",
    stamp: stamp || "first-breath",
    createdAt: new Date().toISOString(),
    reply: "", videoUrl: null, featured: false,
  };

  function pickStamp(key: StampKey) {
    setStamp(key);
    setInked(false);
    requestAnimationFrame(() => setInked(true));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!site) return setError("Pick where we dived.");
    if (!stamp) return setError("Pick your stamp.");
    if ((month && !year) || (!month && year)) return setError("Pick both the month and the year, or leave both blank.");
    if (note.trim().length < LIMITS.note.min) return setError("A few more words. Osama reads every review.");
    if (!consent) return setError("Tick the box so Osama can show your review.");
    setBusy(true);
    try {
      const data = new FormData(e.currentTarget);
      data.set("site", site);
      data.set("stamp", stamp);
      const res = await fetch("/api/logbook", { method: "POST", body: data });
      const json = (await res.json()) as { ok: boolean; error?: string; id?: string; cardUrl?: string };
      if (!json.ok || !json.id || !json.cardUrl) throw new Error(json.error || "Something went wrong. Try again.");
      setDone({ id: json.id, cardUrl: json.cardUrl });
      window.scrollTo({ top: (document.getElementById("sign")?.offsetTop ?? 0) - 40, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) return <Success done={done} preview={preview} number={nextNumber} />;

  const noteLen = note.length;
  return (
    <>
      <div>
        <div className="lb-sign__head">
          <span className="lb-mono">Six short steps</span>
          <h2 className="lb-h2">Write yours.</h2>
          <p className="lb-stand">Your name, where we dived, and what you want to say. I read every page and sign it myself before it goes in the book.</p>
        </div>

        <form ref={formRef} className="lb-form" onSubmit={submit} noValidate>
          <div className="lb-two">
            <div className="lb-field">
              <label className="lb-mono" htmlFor="lb-name">1 · Your name</label>
              <input id="lb-name" name="name" className="lb-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name.max} autoComplete="name" placeholder="Ana" required />
            </div>
            <div className="lb-field">
              <label className="lb-mono" htmlFor="lb-country">Your country</label>
              <input id="lb-country" name="country" className="lb-input" value={country} onChange={(e) => setCountry(e.target.value)} maxLength={LIMITS.country.max} autoComplete="country-name" placeholder="Spain" />
            </div>
          </div>

          <div className="lb-field">
            <span className="lb-label lb-mono">2 · Where we dived</span>
            <div className="lb-chips" role="group" aria-label="Dive site">
              {SITES.map((s) => (
                <button key={s.key} type="button" className="lb-chip" aria-pressed={site === s.key} onClick={() => setSite(s.key)}>
                  {s.label}
                  <small>{s.depth || s.where}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="lb-two">
            <div className="lb-field">
              <span className="lb-label lb-mono">3 · When we dived</span>
              <div className="lb-when">
                <select aria-label="Month" className="lb-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
                  ))}
                </select>
                <select aria-label="Year" className="lb-select" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              <input type="hidden" name="divedOn" value={divedOn} />
              <small>Month and year is enough. Leave it blank if you are not sure.</small>
            </div>
            <div className="lb-field">
              <label className="lb-mono" htmlFor="lb-course">Course, if you did one</label>
              <select id="lb-course" name="course" className="lb-select" value={course} onChange={(e) => setCourse(e.target.value as Course)}>
                {COURSES.map((c) => (
                  <option key={c || "none"} value={c}>{c || "Just diving"}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lb-field">
            <label className="lb-mono" htmlFor="lb-note">4 · Your review</label>
            <textarea id="lb-note" name="note" className="lb-textarea" value={note} onChange={(e) => setNote(e.target.value)} maxLength={LIMITS.note.max} placeholder="How was the dive with Osama? Say it the way you would tell a friend." required />
            <div className={`lb-counter lb-mono${noteLen > LIMITS.note.max - 40 ? " is-over" : ""}`}>
              <span>In your own words. No links, no numbers to call.</span>
              <span>{noteLen} / {LIMITS.note.max}</span>
            </div>
          </div>

          <div className="lb-field">
            <span className="lb-label lb-mono">5 · A photo, if you have one</span>
            <label className="lb-drop">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="lb-drop__thumb" src={photoUrl} alt="" />
              ) : null}
              <span>{photo ? photo.name : "Tap to add a photo from the day. JPEG, PNG or WebP, up to 6 MB."}</span>
              <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
              {photo ? (
                <button type="button" className="lb-drop__remove" onClick={(e) => { e.preventDefault(); setPhoto(null); if (formRef.current) { const input = formRef.current.querySelector<HTMLInputElement>('input[name="photo"]'); if (input) input.value = ""; } }}>
                  Remove
                </button>
              ) : null}
            </label>
          </div>

          <div className="lb-field">
            <span className="lb-label lb-mono">6 · Pick a stamp, then press Submit review</span>
            <div className="lb-stamps" role="group" aria-label="Stamp">
              {STAMPS.map((s) => (
                <button key={s.key} type="button" className="lb-stamp-pick" aria-pressed={stamp === s.key} onClick={() => pickStamp(s.key)}>
                  <Stamp stamp={s.key} uid={`pick-${s.key}`} className="lb-stamp--static" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="lb-consent">
            <input type="checkbox" name="consent" value="yes" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>Osama may show this review on his site and share it. He reads and signs every one; nothing shows until he has.</span>
          </label>

          <div className="lb-honey" aria-hidden="true">
            <label htmlFor="lb-website">Website</label>
            <input id="lb-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {TURNSTILE_KEY ? (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
              <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-theme="dark" data-size="flexible" />
            </>
          ) : null}

          {error ? <p className="lb-error" role="alert">{error}</p> : null}

          <div>
            <button type="submit" className="lb-btn" disabled={busy}>{busy ? "Sending..." : "Submit review"}</button>
          </div>
        </form>
      </div>

      <aside className="lb-preview" aria-label="Preview of your page">
        <span className="lb-mono">Your review, as it will look in the book</span>
        <PageCard entry={preview} number={nextNumber} variant="preview" inkStamp={inked} />
      </aside>
    </>
  );
}

function Success({ done, preview, number }: { done: Done; preview: PageData; number: number }) {
  const [shared, setShared] = useState<"idle" | "sharing" | "no-share">("idle");

  async function share() {
    setShared("sharing");
    try {
      const res = await fetch(done.cardUrl);
      const blob = await res.blob();
      const file = new File([blob], "osamadives-logbook.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: "My review of diving with Osama", text: "osamadives.com/review" });
        setShared("idle");
        return;
      }
      setShared("no-share");
      window.open(done.cardUrl, "_blank", "noopener");
    } catch {
      setShared("no-share");
    }
  }

  return (
    <>
      <div className="lb-done lb-rise">
        <span className="lb-mono">Entry {String(number).padStart(3, "0")} · with Osama</span>
        <h2 className="lb-h2">Your page is with me.</h2>
        <p className="lb-stand">I read every one and sign it myself. Once it is in the book it shows here, usually the same day.</p>
        <p className="lb-stand">Your page is yours to keep: share it to your story and tag <strong>@osama_mohamed_hassan</strong>, or print the keepsake, an A5 page from my logbook with my signature on it.</p>
        <div className="lb-done__actions">
          <button type="button" className="lb-btn" onClick={share} disabled={shared === "sharing"}>{shared === "sharing" ? "Preparing..." : "Share your page"}</button>
          <a className="lb-btn lb-btn--quiet" href={`${done.cardUrl}&format=print`} target="_blank" rel="noopener noreferrer">Print a keepsake</a>
          <a className="lb-btn lb-btn--quiet" href={done.cardUrl} target="_blank" rel="noopener noreferrer">Open the image</a>
          <a className="lb-btn lb-btn--quiet" href="#pages">Back to the book</a>
        </div>
        {shared === "no-share" ? <p className="lb-mono" style={{ color: "var(--light-soft)" }}>Long-press the image to save it, then add it to your story.</p> : null}
      </div>
      <aside className="lb-preview">
        <span className="lb-mono">Your page</span>
        <PageCard entry={preview} number={number} variant="preview" inkStamp />
      </aside>
    </>
  );
}
