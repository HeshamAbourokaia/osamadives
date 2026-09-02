import Image from "next/image";

interface BeholdMediaSize {
  mediaUrl: string;
  height: number;
  width: number;
}

interface BeholdPost {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM";
  isReel: boolean;
  thumbnailUrl: string;
  sizes: {
    small: BeholdMediaSize;
    medium: BeholdMediaSize;
    large: BeholdMediaSize;
    full: BeholdMediaSize;
  };
  caption: string;
}

interface BeholdResponse {
  posts: BeholdPost[];
}

const BEHOLD_FEED_URL = "https://feeds.behold.so/uMh92JNjwTxGtltG2UdH";

async function fetchLatestReel(): Promise<BeholdPost | null> {
  try {
    const res = await fetch(BEHOLD_FEED_URL, {
      next: { revalidate: 21600 }, // 6h ISR cache
    });
    if (!res.ok) return null;
    const data: BeholdResponse = await res.json();
    // Prefer the most recent reel; fall back to most recent post of any type
    return (
      data.posts.find((p) => p.isReel || p.mediaType === "VIDEO") ??
      data.posts[0] ??
      null
    );
  } catch {
    return null;
  }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const day = 86_400_000;
  const days = Math.round(diff / day);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  if (days < 60) return "Last month";
  if (days < 365) return `${Math.round(days / 30)} months ago`;
  return `${Math.round(days / 365)} years ago`;
}

const GENERIC_HEADLINE = "From the Red Sea.";

/**
 * Extract a clean Apple-style headline from the first line of an IG caption.
 * Strips hashtags, @mentions, URLs. Capitalizes first letter. Ends with punctuation.
 * Returns null if no usable text. Caller falls back to GENERIC_HEADLINE.
 */
function captionToHeadline(caption: string | undefined | null): string | null {
  if (!caption) return null;
  const firstLine = caption.split(/\r?\n/)[0]?.trim();
  if (!firstLine) return null;

  let clean = firstLine
    .replace(/#\w+/g, "")
    .replace(/@[\w.]+/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length < 4) return null;

  clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  if (clean.length > 60) clean = clean.slice(0, 60).replace(/\s+\S*$/, "") + "…";
  if (!/[.!?…]$/.test(clean)) clean += ".";

  return clean;
}

export default async function FeaturedReel() {
  const post = await fetchLatestReel();
  if (!post) return null;

  const imgUrl = post.sizes.large.mediaUrl;
  const ago = timeAgo(post.timestamp);
  const isVideo = post.isReel || post.mediaType === "VIDEO";
  const headline = captionToHeadline(post.caption) ?? GENERIC_HEADLINE;

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[#5a5f4e] via-[#4a4f3e] to-[#2a2e25] text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text side */}
          <div className="text-center md:text-left order-2 md:order-1">
            <p className="text-xs uppercase tracking-[0.25em] text-white/60 font-semibold mb-4">
              Latest {isVideo ? "reel" : "post"} &middot; {ago}
            </p>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-[1.05]"
              style={{ fontFamily: "serif" }}
            >
              {headline}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-md md:max-w-none mx-auto md:mx-0">
              Wherever Osama was on his most recent dive. Sidemount training, the Blue Hole, reef life, a quiet day on the boat. This rotates whenever he posts.
            </p>
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-semibold border-b border-white/40 hover:border-white pb-0.5 transition-colors"
              aria-label={`Open the latest ${isVideo ? "reel" : "post"} on Instagram`}
            >
              Watch on Instagram
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Visual side */}
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full max-w-[280px] sm:max-w-xs aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_25px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 group focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Open the latest reel on Instagram"
            >
              <Image
                src={imgUrl}
                alt={`Latest dive by @osama_mohamed_hassan from ${ago}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, 320px"
                unoptimized
              />
              {/* Play icon overlay. Only on videos. */}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Reel/Post badge */}
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[10px] sm:text-xs px-2 py-1 rounded-full flex items-center gap-1.5 z-10">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>{isVideo ? "Reel" : "Post"}</span>
              </div>
              {/* Hover hint */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <span className="text-white text-sm font-semibold drop-shadow-lg">
                  Tap to {isVideo ? "play" : "open"} on Instagram &rarr;
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
