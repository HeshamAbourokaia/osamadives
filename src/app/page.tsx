/* eslint-disable @next/next/no-img-element */
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import InstagramFeed from "@/components/InstagramFeed";
import DescentBoot from "./DescentBoot";
import HomeStrip from "./logbook/HomeStrip";
import "./descent.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--lb-display", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--lb-mono", display: "swap" });

// The homepage regenerates every minute, and instantly when a logbook page is approved.
export const revalidate = 60;

const WHATSAPP = "https://wa.me/201090208050?text=" + encodeURIComponent("Hi Osama! I would love to chat about diving in Dahab.");

// The page is one dive. Markup and copy are the verified descent build (24 Aug 2026),
// driven by the vendored scrollcraft engine that DescentBoot mounts after hydration.
// Internal links are plain anchors on purpose: leaving this page is a full load, so the
// scroll engine never outlives it.
export default function Home() {
  return (
    <div className={`descent ${archivo.variable} ${plex.variable}`}>
      <span data-sc-progress />
      <div className="sc-grain" aria-hidden="true" />
      <p className="brand">Osama<span style={{ opacity: 0.75 }}>Dives</span></p>
      <nav className="topnav" aria-label="Site">
        <a href="/dive-sites">Sites</a>
        <a href="/blog">Journal</a>
        <a href="/gallery">Gallery</a>
        <a href="/logbook">Logbook</a>
      </nav>
      <aside className="hud mono" id="hud" aria-hidden="true">
        <span className="hud__depth"><span id="hud-depth">00.0</span> <small>M</small></span>
        <span className="hud__label" id="hud-label">Surface</span>
        <span className="hud__track"><i id="hud-track" /></span>
      </aside>

      <main id="descent-main">
        {/* ACT 1 · ENTRY: the sea, scrubbing under the wheel from the first pixel */}
        <section className="g-abyss" data-sc-act="scrub" data-sc-span="2.3" style={{ "--sc-span": 2.3 } as React.CSSProperties} data-sc-dwell="0.35">
          <div data-sc-stage>
            <img className="sc-stage__poster" src="/descent/hero-poster.webp" alt="" />
            <video data-sc-scrub data-sc-src="/descent/hero.mp4" data-sc-src-mobile="/descent/hero-m.mp4" muted playsInline />
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="copy-scrim" aria-hidden="true" />
            <div className="sea-scrim-m" aria-hidden="true" />
            <div className="sc-copy sc-copy--lead entry-copy" data-sc-cue="0 0.85 0">
              <span className="microcopy">Dive log · Dahab, South Sinai · kept since 1983</span>
              <h1 data-sc-kinetic="lines">The sea took him in.</h1>
              <p className="stand">Osama is a PADI Master Scuba Diver Trainer, born on this shore. His family has lived beside the water since 1983. Scroll to descend.</p>
              <a className="cta" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Message Osama</a>
            </div>
            <div className="entry-foot microcopy" data-sc-cue="0 0.5 0 0.3">
              <span>Red Sea · 28 C in summer</span>
              <span>Entry · Lighthouse reef</span>
            </div>
          </div>
        </section>

        {/* ACT 2 · THE GUIDE: magazine cover on paper, cursor light on the surface */}
        <section className="g-bone" data-sc-act="pin" data-sc-span="2.1" style={{ "--sc-span": 2.1 } as React.CSSProperties} data-sc-spotlight>
          <div data-sc-stage className="guide-stage">
            <div className="guide-cover">
              <div>
                <div className="rule-draw" aria-hidden="true" />
                <span className="microcopy">Stop 1 · 12 metres · your guide</span>
                <h2 data-sc-cue="0 1 0 0.1" data-sc-kinetic="lines">Meet Osama.</h2>
                <p className="sc-body" data-sc-cue="0.06 1 0.12 0.1">Osama Mohamed Hassan was born into a Dahab of fishing boats and palm shelters on the sand. He has spent his life in this water. He briefs slowly, watches closely, and laughs easily.</p>
                <dl className="ledger" data-sc-cue="0.12 1 0.14 0.1">
                  <div><dt>Rating</dt><dd>PADI Master Scuba Diver Trainer</dd></div>
                  <div><dt>Family</dt><dd>Fourth family of Dahab, on this shore since 1983</dd></div>
                  <div><dt>The kitchen</dt><dd>Shark Restaurant, open since the family arrived</dd></div>
                  <div><dt>Teaches</dt><dd>First breath to first professional step</dd></div>
                </dl>
              </div>
              <div className="guide-plate">
                <span className="exhibit-letter" aria-hidden="true">O</span>
                <figure data-sc-reveal="down" data-sc-reveal-at="0.02 0.4" data-sc-tilt="5">
                  <img src="/descent/osama-portrait.webp" width={960} height={956} alt="Osama in his wetsuit on the shore at Dahab, checking his regulator, Sinai mountains behind him" />
                  <figcaption>Before the morning dive · Lighthouse, Dahab</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ACT 3 · SILENCE: one ledger line in the dark */}
        <section className="g-night silence">
          <span className="microcopy" data-sc-in>Entry 001 · August 1987</span>
          <p className="line" data-sc-in>Someone brought a camera to the beach.</p>
        </section>

        {/* ACT 4 · THE PEAK: the print becomes the man, the year runs behind it */}
        <section className="g-night" data-sc-act="pin" data-sc-span="2.9" style={{ "--sc-span": 2.9 } as React.CSSProperties}>
          <div data-sc-stage className="peak-stage">
            <div className="peak-year sc-nums" data-sc-count="1987 2026" data-sc-count-at="0.1 0.8" aria-hidden="true">1987</div>
            <div className="peak-frame">
              <div className="peak-mat">
                <div className="peak-plate">
                  <img src="/descent/peak-1987.webp" width={1400} height={933} alt="A scratched family photograph from August 1987: four young people arm in arm on the Dahab shore beside an orange Bedouin truck" />
                  <img className="now" src="/descent/peak-now.webp" width={1400} height={933} alt="Osama today on the same shore, in his wetsuit before a dive, the sea on his left and the Sinai mountains behind" />
                </div>
              </div>
              <div className="peak-captions">
                <p data-sc-cue="0 0.46 0 0.1">The shore at Assalah · August 1987 · from the family album</p>
                <p data-sc-cue="0.5 1 0.1 0.08">The same shore, this year · the boy from the beach will hold your regulator</p>
              </div>
            </div>
          </div>
        </section>

        {/* BRIDGE · the seam between the print and the sea carries one line */}
        <section className="g-abyss silence" style={{ minHeight: "34vh" }}>
          <span className="microcopy" data-sc-in>Stop 2 · the sites</span>
          <p className="line" data-sc-in>From the sand, straight into the sea.</p>
        </section>

        {/* ACT 5 · THE COAST: lateral travel, south to north, five real dives */}
        <section className="g-abyss" data-sc-act="pan" data-sc-span="3.5" style={{ "--sc-span": 3.5 } as React.CSSProperties}>
          <div data-sc-stage>
            <div className="coast-rail" data-sc-pan="0.05">
              <div className="coast-lead">
                <span className="microcopy">Stop 2 · the sites · south to north</span>
                <h2>One shore. Five dives from the sand.</h2>
                <p className="sc-body">No boat, no schedule. You walk in from the beach, the reef starts at your fins. These are the sites Osama grew up on, in the order the shore road meets them.</p>
              </div>
              <a className="station" href="/dive-sites/three-pools-dahab" data-sc-tilt="4">
                <span className="microcopy">Three Pools</span>
                <h3>Three Pools</h3>
                <span className="depth mono">03-25 <small>M</small></span>
                <p>Three sandy lagoons opening onto coral gardens. Calm, bright, and easy. Open Water and up.</p>
              </a>
              <a className="station" href="/dive-sites/lighthouse-reef-dahab" data-sc-tilt="4">
                <span className="microcopy">In town</span>
                <h3>Lighthouse</h3>
                <span className="depth mono">03-30 <small>M</small></span>
                <p>The house reef. First breaths happen here, and Osama still finds things on it after a lifetime. All levels.</p>
              </a>
              <a className="station" href="/dive-sites/eel-garden-dahab" data-sc-tilt="4">
                <span className="microcopy">Town, north end</span>
                <h3>Eel Garden</h3>
                <span className="depth mono">05-25 <small>M</small></span>
                <p>A slope of garden eels swaying out of the sand like sea grass. Open Water and up.</p>
              </a>
              <figure className="station-img">
                <img src="/descent/sea-poster.webp" alt="A coral-crusted pillar rising from the sea floor at Dahab, a diver hovering beside it" />
                <figcaption>The reef, on an ordinary morning</figcaption>
              </figure>
              <a className="station" href="/dive-sites/the-canyon-dahab" data-sc-tilt="4">
                <span className="microcopy">North of town</span>
                <h3>The Canyon</h3>
                <span className="depth mono">10-30 <small>M</small></span>
                <p>A rift in the reef lit by shafts of sun, full of glassfish. Advanced, properly briefed.</p>
              </a>
              <a className="station" href="/dive-sites/blue-hole-dahab" data-sc-tilt="4">
                <span className="microcopy">The famous one</span>
                <h3>Blue Hole</h3>
                <span className="depth mono">05-100 <small>M</small></span>
                <p>The icon. A circle of deep blue punched into the reef. Osama dives it within your training, every time.</p>
              </a>
              <div className="coast-note">
                <span className="microcopy">The rule of the house</span>
                <p>Every brief starts on the sand, and every dive stays inside your training.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ACT 6 · THE SCHOOL: courses mounted as exhibits */}
        <section className="g-bone">
          <div className="school">
            <div className="school-head" data-sc-in data-sc-stagger="60">
              <span className="microcopy">Stop 3 · 30 metres · the school</span>
              <h2>Learn it properly.</h2>
              <p className="sc-body">Small groups, slow briefings, the same reef he learned on. Pick the course that matches where you are, and he takes you the rest of the way.</p>
            </div>
            <div className="exhibits" data-sc-in data-sc-stagger="90">
              <figure className="exhibit">
                <span className="letter" aria-hidden="true">I</span>
                <div className="exhibit-card" data-sc-tilt="5">
                  <img src="/descent/arch-lagoon.webp" alt="The turquoise lagoon at Dahab where first dives happen" />
                  <div className="row"><h3>Intro Dive</h3><span className="spec">Half a day</span></div>
                  <p>Never tried it. A pool, then the sea, no certification, just a first breath underwater.</p>
                </div>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true">O</span>
                <div className="exhibit-card" data-sc-tilt="5">
                  <img src="/descent/padi-first-fins.webp" alt="A young student in a small wetsuit standing proudly in the street at Assalah" />
                  <div className="row"><h3>Open Water</h3><span className="spec">3-4 days · 18 m</span></div>
                  <p>The certification. You leave able to dive anywhere in the world.</p>
                </div>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true">A</span>
                <div className="exhibit-card" data-sc-tilt="5">
                  <img src="/descent/bluehole-aerial.webp" alt="The Blue Hole of Dahab seen from above, a deep blue circle in the reef shelf" />
                  <div className="row"><h3>Advanced</h3><span className="spec">2 days · 30 m</span></div>
                  <p>Five adventure dives. Opens the deep sites, night diving included.</p>
                </div>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true">R</span>
                <div className="exhibit-card" data-sc-tilt="5">
                  <img src="/descent/osama-truck.webp" alt="Osama on the back of a pickup truck in his wetsuit after a dive, talking to divers" />
                  <div className="row"><h3>Rescue Diver</h3><span className="spec">4 days</span></div>
                  <p>The course that turns you into a buddy worth diving with.</p>
                </div>
              </figure>
            </div>
            <dl className="school-more" data-sc-in>
              <div><dt>Divemaster</dt><dd>Several weeks at his side. The first professional step, if you want one.</dd></div>
              <div><dt>Specialties</dt><dd>Sidemount, nitrox, deep, night. Picked to fit the reefs you want to dive.</dd></div>
            </dl>
          </div>
        </section>

        {/* ACT 7 · SURFACING: the camera breaks the surface, the gauge reads zero */}
        <section className="g-abyss" data-sc-act="scrub" data-sc-span="1.4" style={{ "--sc-span": 1.4 } as React.CSSProperties} data-sc-dwell="0.3">
          <div data-sc-stage>
            <img className="sc-stage__poster" src="/descent/surface-poster.webp" alt="" />
            <video data-sc-scrub data-sc-src="/descent/surface.mp4" data-sc-src-mobile="/descent/surface-m.mp4" muted playsInline />
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="copy-scrim" aria-hidden="true" />
            <div className="sea-scrim-m" aria-hidden="true" />
            <div className="sc-copy sc-copy--lead surface-copy" data-sc-cue="0.05">
              <h2>Come up when you&apos;re ready.</h2>
              <p className="sc-body">Send a message and start planning your water. He answers himself.</p>
              <a className="cta" data-sc-magnet="0.26" data-sc-rise="0" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Message Osama</a>
            </div>
            <div className="surface-foot" data-sc-cue="0.2">
              <span>OsamaDives · family on this shore since 1983</span>
              <a href="https://instagram.com/osama_mohamed_hassan" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://facebook.com/osamasharks" target="_blank" rel="noopener noreferrer">Facebook</a>
              <span className="ar" lang="ar">دهب · جنوب سيناء</span>
            </div>
          </div>
        </section>
      </main>

      {/* Back on the surface: the logbook, the live feed, the way around the site */}
      <div className="tail">
        <HomeStrip />
        <InstagramFeed />
        <footer className="tail-foot">
          <span>OsamaDives · family on this shore since 1983 · Dahab, South Sinai</span>
          <nav aria-label="Footer">
            <a href="/dive-sites">Dive sites</a>
            <a href="/blog">Journal</a>
            <a href="/gallery">Gallery</a>
            <a href="/logbook">Logbook</a>
            <a href="/featured/chatgpt">Featured</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </nav>
        </footer>
      </div>
      <DescentBoot />
    </div>
  );
}
