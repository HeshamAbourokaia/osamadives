"use client";

import { useEffect, useState } from "react";

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Mode = "checking" | "installed" | "android" | "ios-safari" | "ios-other" | "desktop";

// Tells whoever opens this page exactly how to keep it, in their own phone's words.
export default function InstallCard() {
  const [mode, setMode] = useState<Mode>("checking");
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return setMode("installed");

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    // On an iPhone only Safari can keep a page on the home screen. Chrome, Firefox
    // and the in-app browsers all report themselves in the user agent.
    const iosSafari = isIOS && !/CriOS|FxiOS|EdgiOS|OPiOS|FBAN|FBAV|Instagram|Line/.test(ua);

    if (isIOS) setMode(iosSafari ? "ios-safari" : "ios-other");
    else if (isAndroid) setMode("android");
    else setMode("desktop");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setMode("installed"));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("https://www.osamadives.com/card");
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  if (mode === "checking" || mode === "installed") return null;

  return (
    <div className="keep">
      {mode === "android" ? (
        prompt ? (
          <button
            type="button"
            className="keep__btn"
            onClick={async () => {
              await prompt.prompt();
              const choice = await prompt.userChoice;
              if (choice.outcome === "accepted") setMode("installed");
              setPrompt(null);
            }}
          >
            Keep this on my home screen
          </button>
        ) : (
          <p className="keep__text">
            To keep this: tap the <strong>three dots</strong> at the top of Chrome, then{" "}
            <strong>Add to Home screen</strong>.
          </p>
        )
      ) : null}

      {mode === "ios-safari" ? (
        <p className="keep__text">
          To keep this: tap <strong>Share</strong> at the bottom of Safari, then{" "}
          <strong>Add to Home Screen</strong>.
        </p>
      ) : null}

      {mode === "ios-other" ? (
        <>
          <p className="keep__text">
            iPhone only lets <strong>Safari</strong> keep a page on the home screen. Copy this
            address, open Safari and paste it, then tap Share and Add to Home Screen.
          </p>
          <button type="button" className="keep__btn keep__btn--quiet" onClick={copy}>
            {copied ? "Copied" : "Copy the address"}
          </button>
        </>
      ) : null}

      {mode === "desktop" ? (
        <p className="keep__text">Open osamadives.com/card on your phone to keep it on the home screen.</p>
      ) : null}
    </div>
  );
}
