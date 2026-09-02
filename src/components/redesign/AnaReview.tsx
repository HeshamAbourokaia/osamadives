const REVIEW_URL =
  "https://www.google.com/maps/reviews/@28.489362,34.5157305,17z/data=!3m1!4b1!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT25OWFFtMDFOamhIZGpab1UzTjZXRlpFZVdkUWEwRRAB!2m1!1s0x0:0x4cef5c73b1ff7bb4?hl=en-GB";

export default function AnaReview() {
  return (
    <section
      id="review"
      className="bg-bone text-abyss py-28 sm:py-36 px-5 sm:px-10 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <p className="label-eyebrow text-reef mb-10 text-center">
          A note from a student
        </p>
        <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl leading-snug text-abyss text-balance">
          &ldquo;He never forced me or held me underwater, so I always felt safe
          with him. Teaching someone with claustrophobia and panic attacks
          requires a completely different level of skill, intelligence,
          patience, and understanding, and Osama has all of this.&rdquo;
        </blockquote>
        <div className="mt-12 pt-8 border-t border-abyss/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-abyss">Ana Shinobi</p>
            <p className="text-sm text-abyss/55">
              Open Water student. May 2026. Verified Google review.
            </p>
          </div>
          <a
            href={REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-reef hover:text-abyss transition-colors"
          >
            Read on Google
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
