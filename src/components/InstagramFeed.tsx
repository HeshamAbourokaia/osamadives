"use client";

import Script from "next/script";

const IG_PROFILE_URL = "https://instagram.com/osama_mohamed_hassan";
const HANDLE = "@osama_mohamed_hassan";
const BEHOLD_FEED_ID = "uMh92JNjwTxGtltG2UdH";

export default function InstagramFeed() {
  return (
    <section id="instagram-feed" className="py-20 px-4 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-light text-gray-900 mb-2"
            style={{ fontFamily: "serif" }}
          >
            Latest from Instagram
          </h2>
          <a
            href={IG_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="text-sm">{HANDLE}</span>
          </a>
        </div>

        {/* Behold widget. Renders client-side after widget.js loads. */}
        <div className="max-w-4xl mx-auto">
          <behold-widget feed-id={BEHOLD_FEED_ID}></behold-widget>
        </div>

        <Script
          src="https://w.behold.so/widget.js"
          type="module"
          strategy="afterInteractive"
        />

        <div className="text-center mt-10">
          <a
            href={IG_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#0a7d70] font-semibold hover:underline"
          >
            Follow {HANDLE} on Instagram
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
