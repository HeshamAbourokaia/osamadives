"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";

interface Props {
  name: "photoUrl" | "videoUrl";
  label: string;
  accept: string;
  current: string | null;
}

// Pick a file, watch it go up, and the address lands in the form ready to save.
export default function MediaUpload({ name, label, accept, current }: Props) {
  const [url, setUrl] = useState(current ?? "");
  const [pct, setPct] = useState<number | null>(null);
  const [problem, setProblem] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const pick = async (file: File) => {
    setProblem("");
    setPct(0);
    try {
      const blob = await upload(`logbook/${name}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/logbook/blob",
        onUploadProgress: ({ percentage }) => setPct(Math.round(percentage)),
      });
      setUrl(blob.url);
      setPct(null);
    } catch {
      setProblem("That did not upload. Try a smaller file, or check the signal.");
      setPct(null);
    }
  };

  const isVideo = name === "videoUrl";

  return (
    <div className="lb-field lb-media">
      <span className="lb-mono">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="lb-media__has">
          {isVideo ? (
            <video src={url} controls playsInline preload="metadata" className="lb-media__prev" />
          ) : (
            <img src={url} alt="" className="lb-media__prev" />
          )}
          <div className="lb-media__row">
            <button type="button" className="lb-btn lb-btn--quiet lb-btn--ink" onClick={() => input.current?.click()}>
              Replace
            </button>
            <button type="button" className="lb-btn lb-btn--danger" onClick={() => setUrl("")}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="lb-media__drop" onClick={() => input.current?.click()}>
          {pct === null ? (
            <>Tap to add {isVideo ? "a video" : "a photo"} from your phone</>
          ) : (
            <>Uploading… {pct}%</>
          )}
        </button>
      )}

      {pct !== null ? (
        <progress className="lb-media__bar" value={pct} max={100} aria-label="Upload progress" />
      ) : null}
      {problem ? <p className="lb-media__no" role="alert">{problem}</p> : null}

      <input
        ref={input}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pick(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
