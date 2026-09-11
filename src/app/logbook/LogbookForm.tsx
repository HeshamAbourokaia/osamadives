"use client";

import Script from "next/script";
import { upload } from "@vercel/blob/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITES } from "@/lib/logbook/sites";
import { STAMPS, orderStamps } from "@/lib/logbook/stamps";

const MAX_STAMPS = 5;
import { COURSES, LIMITS, type Course, type SiteKey, type StampKey } from "@/lib/logbook/types";
import PickerSheet from "./PickerSheet";
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
  const [sites, setSites] = useState<SiteKey[]>([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const divedOn = month && year ? `${year}-${month}` : "";
  const [courses, setCourses] = useState<Course[]>([]);
  const [stamps, setStamps] = useState<StampKey[]>([]);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [clipPct, setClipPct] = useState<number | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [inked, setInked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);
  const clipUrl = useMemo(() => (video ? URL.createObjectURL(video) : null), [video]);
  useEffect(() => () => { if (clipUrl) URL.revokeObjectURL(clipUrl); }, [clipUrl]);

  // Arriving from a dive-site page preselects that site.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("site");
    if (wanted && SITES.some((s) => s.key === wanted)) setSites([wanted as SiteKey]);
  }, []);

  const preview: PageData = {
    id: "preview",
    name, country, note, divedOn, photoUrl,
    course: courses[0] ?? "",
    courses,
    site: sites[0] ?? "lighthouse-reef-dahab",
    sites: sites.length ? sites : ["lighthouse-reef-dahab"],
    stamps: stamps.length ? stamps : ["introduction"],
    createdAt: new Date().toISOString(),
    reply: "", videoUrl: clipUrl, featured: false,
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!sites.length) return setError("Pick where we dived.");
    if (!stamps.length) return setError("Pick at least one stamp.");
    if ((month && !year) || (!month && year)) return setError("Pick both the month and the year, or leave both blank.");
    if (note.trim().length < LIMITS.note.min) return setError("A few more words. Osama reads every review.");
    if (!consent) return setError("Tick the box so Osama can show your review.");
    setBusy(true);
    try {
      const data = new FormData(e.currentTarget);
      data.delete("site");
      for (const k of sites) data.append("site", k);
      data.delete("course");
      for (const c of courses) data.append("course", c);
      data.delete("stamp");
      for (const k of stamps) data.append("stamp", k);
      // The clip goes straight to storage first, so a minute of video never squeezes
      // through the form request; only its address travels with the page.
      data.delete("clip");
      if (video) {
        if (video.size > LIMITS.clipBytes) throw new Error("That clip is over 80 MB. Trim it to a minute or so, or send it to Osama on WhatsApp after.");
        setClipPct(0);
        const safe = video.name.replace(/[^a-z0-9.]+/gi, "-").slice(-60) || "clip.mp4";
        const blob = await upload(`logbook/clips/${safe}`, video, {
          access: "public",
          handleUploadUrl: "/api/logbook/blob",
          onUploadProgress: ({ percentage }) => setClipPct(Math.round(percentage)),
        });
        data.set("videoUrl", blob.url);
        setClipPct(null);
      }
      const res = await fetch("/api/logbook", { method: "POST", body: data });
      const json = (await res.json()) as { ok: boolean; error?: string; id?: string; cardUrl?: string };
      if (!json.ok || !json.id || !json.cardUrl) throw new Error(json.error || "Something went wrong. Try again.");
      setDone({ id: json.id, cardUrl: json.cardUrl });
      window.scrollTo({ top: (document.getElementById("sign")?.offsetTop ?? 0) - 40, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
      setClipPct(null);
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
            <PickerSheet
              id="lb-site"
              label="Where we dived"
              placeholder="Pick a site, or several"
              options={SITES.map((s) => ({ value: s.key, label: s.label, hint: s.depth || s.where }))}
              value={sites}
              onChange={(v) => setSites(v as SiteKey[])}
            />
            <small>Pick every site we went to.</small>
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
              <span className="lb-label lb-mono">Courses, if you did any</span>
              <PickerSheet
                id="lb-course"
                label="Courses you did"
                placeholder="Just diving"
                options={COURSES.filter(Boolean).map((c) => ({ value: c, label: c }))}
                value={courses}
                onChange={(v) => setCourses(v as Course[])}
              />
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
            <span className="lb-label lb-mono">Or a short clip from the day</span>
            <label className="lb-drop">
              {clipUrl ? <video className="lb-drop__thumb" src={clipUrl} muted playsInline preload="metadata" /> : null}
              <span>{video ? video.name : "Tap to add a clip. MP4 or MOV, up to a minute or so (80 MB). It shows once Osama has read your page."}</span>
              <input type="file" name="clip" accept="video/mp4,video/quicktime,video/webm" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
              {video ? (
                <button type="button" className="lb-drop__remove" onClick={(e) => { e.preventDefault(); setVideo(null); if (formRef.current) { const input = formRef.current.querySelector<HTMLInputElement>('input[name="clip"]'); if (input) input.value = ""; } }}>
                  Remove
                </button>
              ) : null}
            </label>
          </div>

          <div className="lb-field">
            <span className="lb-label lb-mono">6 · Your stamps, then press Submit review</span>
            <PickerSheet
              id="lb-stamps"
              label="Your stamps"
              placeholder="Pick one to five"
              max={MAX_STAMPS}
              options={STAMPS.map((s) => ({ value: s.key, label: s.label, icon: <Stamp stamp={s.key} uid={`pick-${s.key}`} className="lb-stamp--static" /> }))}
              value={stamps}
              onChange={(v) => { setStamps(orderStamps(v as StampKey[])); setInked(false); requestAnimationFrame(() => setInked(true)); }}
            />
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
            <button type="submit" className="lb-btn" disabled={busy}>{busy ? (clipPct !== null ? `Sending your clip… ${clipPct}%` : "Sending...") : "Submit review"}</button>
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
      const file = new File([blob], "osamadives-review.png", { type: "image/png" });
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
