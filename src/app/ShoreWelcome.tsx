/* eslint-disable @next/next/no-img-element */
import { existsSync } from "node:fs";
import { join } from "node:path";
import CourseFinder from "./CourseFinder";
import WhenToCome from "./WhenToCome";

const REVIEW = "https://www.google.com/maps/reviews/@28.489362,34.5157305,17z/data=!3m1!4b1!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT25OWFFtMDFOamhIZGpab1UzTjZXRlpFZVdkUWEwRRAB!2m1!1s0x0:0x4cef5c73b1ff7bb4?hl=en-GB";

/** The real welcome recording is optional; never substitute a synthetic Osama. */
export default function ShoreWelcome() {
  const recorded = ["osama-welcome.mp4", "osama-welcome-en.vtt", "osama-welcome-ar.vtt"]
    .every((name) => existsSync(join(process.cwd(), "public", "welcome", name)));
  return (
    <section className="shore-welcome" aria-labelledby="shore-heading">
      <div className="shore-welcome__inner">
        <div className="shore-welcome__intro">
          <figure className="shore-welcome__photo">
            {recorded ? (
              <video controls playsInline preload="none" poster="/descent/osama-portrait.webp" aria-label="A welcome from Osama">
                <source src="/welcome/osama-welcome.mp4" type="video/mp4" />
                <track kind="captions" src="/welcome/osama-welcome-en.vtt" srcLang="en" label="English" default />
                <track kind="captions" src="/welcome/osama-welcome-ar.vtt" srcLang="ar" label="العربية" />
              </video>
            ) : (
              <img src="/descent/osama-portrait-m.webp" width={800} height={797} loading="lazy" alt="Osama getting ready on the shore, with the Sinai mountains behind him" />
            )}
            <figcaption>On the shore · before the morning dive</figcaption>
          </figure>
          <div>
            <span className="microcopy">A little sun. Time to settle in.</span>
            <h2 id="shore-heading">A familiar face,<br />before your first dive.</h2>
            <p>Meet Osama on the shore, talk through your experience, and find a pace that feels right. The sea will still be there when you are ready.</p>
            <blockquote>
              <p>“He showed so much patience, understanding and professionalism that I slowly started building trust underwater again.”</p>
              <cite>Open Water student · May 2026 <a href={REVIEW} target="_blank" rel="noopener noreferrer">Read the full Google review ↗</a></cite>
            </blockquote>
          </div>
        </div>
        <div className="shore-planner" id="plan-your-dive">
          <div className="shore-planner__heading"><span className="microcopy">Your time in Dahab</span><h2>Start with what suits you.</h2><p>A few answers now make the conversation with Osama easier.</p></div>
          <div className="trip-tools">
            <details className="trip-tool"><summary>Find a dive or course <span aria-hidden="true">＋</span></summary><CourseFinder /></details>
            <details className="trip-tool"><summary>Choose your time of year <span aria-hidden="true">＋</span></summary><WhenToCome /></details>
          </div>
          <a className="shore-prep-link" href="/before-you-arrive">Already planning your trip? Your arrival checklist →</a>
        </div>
      </div>
    </section>
  );
}
