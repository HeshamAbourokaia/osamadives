"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITES } from "@/lib/logbook/sites";
import { STAMPS } from "@/lib/logbook/stamps";
import { COURSES, LIMITS, type Course, type SiteKey, type StampKey } from "@/lib/logbook/types";
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
  const [divedOn, setDivedOn] = useState("");
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
    if (note.trim().length < LIMITS.note.min) return setError("A few more words. Osama reads every page.");
    if (!consent) return setError("Tick the box so Osama can show your page.");
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
          <span className="lb-mono">A blank page</span>
          <h2 className="lb-h2">Write yours.</h2>
          <p className="lb-stand">Your name, where we dived, and what you want to say. I read every page and sign it myself before it goes in the book.</p>
        </div>

        <form ref={formRef} className="lb-form" onSubmit={submit} noValidate>
          <div className="lb-two">
            <div className="lb-field">
              <label className="lb-mono" htmlFor="lb-name">Your name</label>
              <input id="lb-name" name="name" className="lb-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name.max} autoComplete="name" placeholder="Ana" required />
            </div>
            <div className="lb-field">
              <label className="lb-mono" htmlFor="lb-country">From</label>
              <input id="lb-country" name="country" className="lb-input" value={country} onChange={(e) => setCountry(e.target.value)} maxLength={LIMITS.country.max} autoComplete="country-name" placeholder="Spain" />
            </div>
          </div>

          <div className="lb-field">
            <span className="lb-label lb-mono">Where we dived</span>
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
              <label className="lb-mono" htmlFor="lb-when">When</label>
              <input id="lb-when" name="divedOn" className="lb-input" type="month" value={divedOn} onChange={(e) => setDivedOn(e.target.value)} min="2011-01" max={new Date().toISOString().slice(0, 7)} />
            </div>
            <div className="lb-field">
              <label className="lb-mono" htmlFor="lb-course">Course, if any</label>
              <select id="lb-course" name="course" className="lb-select" value={course} onChange={(e) => setCourse(e.target.value as Course)}>
                {COURSES.map((c) => (
                  <option key={c || "none"} value={c}>{c || "Just diving"}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lb-field">
            <label className="lb-mono" htmlFor="lb-note">Your note</label>
            <textarea id="lb-note" name="note" className="lb-textarea" value={note} onChange={(e) => setNote(e.target.value)} maxLength={LIMITS.note.max} placeholder="What you want Osama to keep." required />
            <div className={`lb-counter lb-mono${noteLen > LIMITS.note.max - 40 ? " is-over" : ""}`}>
              <span>In your own words. No links, no numbers to call.</span>
              <span>{noteLen} / {LIMITS.note.max}</span>
            </div>
          </div>

          <div className="lb-field">
            <span className="lb-label lb-mono">A photo, if you have one</span>
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
            <span className="lb-label lb-mono">Your stamp</span>
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
            <span>Osama may show this page on his site and share it. He signs every page himself; nothing shows until he has.</span>
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
            <button type="submit" className="lb-btn" disabled={busy}>{busy ? "Stamping..." : "Stamp it"}</button>
          </div>
        </form>
      </div>

      <aside className="lb-preview" aria-label="Preview of your page">
        <span className="lb-mono">Your page, as I will see it</span>
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
        await nav.share({ files: [file], title: "I signed Osama's logbook", text: "osamadives.com/logbook" });
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
        <p className="lb-stand">If you want to show your page now, it is yours to share. Tag <strong>@osama_mohamed_hassan</strong> and I will see it.</p>
        <div className="lb-done__actions">
          <button type="button" className="lb-btn" onClick={share} disabled={shared === "sharing"}>{shared === "sharing" ? "Preparing..." : "Share your page"}</button>
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
