"use client";

import { useEffect, useState } from "react";

type Prompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/**
 * Keep it on your phone. On Android the phone offers to add the site to the home screen
 * with the seal as its icon; on an iPhone the way is Share, then Add to Home Screen, so
 * that is what it says. It only appears on a phone, on a second visit, and never once
 * the site is already installed.
 */
export default function AddToHome() {
  const [mode, setMode] = useState<"android" | "ios" | null>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;
    let visits = 0;
    try { visits = Number(localStorage.getItem("od-visits") ?? 0) + 1; localStorage.setItem("od-visits", String(visits)); } catch { visits = 2; }
    if (visits < 2) return;
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);
    if (ios) { setMode("ios"); return; }
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as Prompt); setMode("android"); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  if (!mode || done) return null;
  return (
    <div className="keep only-mobile">
      <img src="/brand/stamp-192.png" alt="" width={44} height={44} className="keep__icon" />
      <div className="keep__words">
        <strong>Keep OsamaDives on your phone.</strong>
        {mode === "android" ? (
          <button type="button" className="keep__btn" onClick={async () => { if (!prompt) return; await prompt.prompt(); const c = await prompt.userChoice; if (c.outcome === "accepted") setDone(true); }}>Add to home screen</button>
        ) : (
          <span>Tap Share, then <em>Add to Home Screen</em>. It opens like an app, and the pages you have seen open with no signal.</span>
        )}
      </div>
    </div>
  );
}
