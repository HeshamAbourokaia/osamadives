"use client";

import { useEffect, useState } from "react";

// The end of a story on a phone: share it on WhatsApp, and after the third story
// read, one quiet line asking for a review from anyone who has dived with him.
export default function StoryTail({ title, url }: { title: string; url: string }) {
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    try {
      const key = "od_stories_read";
      const read = new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
      read.add(url);
      localStorage.setItem(key, JSON.stringify([...read]));
      if (read.size >= 3 && !localStorage.getItem("od_review_nudged")) setNudge(true);
    } catch {}
  }, [url]);
  return (
    <div className="story-tail only-mobile">
      <a className="story-tail__share" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer">Share this story on WhatsApp</a>
      {nudge ? (
        <div className="story-tail__nudge" role="note">
          <p>Three stories in. If you have dived with me, I would love your own page in the book.</p>
          <a href="/review#sign" onClick={() => { try { localStorage.setItem("od_review_nudged", "1"); } catch {} }}>Write me a review</a>
        </div>
      ) : null}
    </div>
  );
}
