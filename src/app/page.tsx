/* eslint-disable @next/next/no-img-element */
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import InstagramFeed from "@/components/InstagramFeed";
import DescentBoot from "./DescentBoot";
import OrbitScene from "./OrbitScene";
import HomeStrip from "./logbook/HomeStrip";
import DescentNav from "./DescentNav";
import Bubbles from "./Bubbles";
import AiFeatureRibbon from "@/components/AiFeatureRibbon";
import LogbookRibbon from "@/components/LogbookRibbon";
import InstagramRibbon from "@/components/InstagramRibbon";
import BackToTop from "@/components/BackToTop";
import { blogPosts } from "@/lib/blog-posts";
import { galleryPhotos } from "@/lib/gallery-config";
import { getStore } from "@/lib/logbook/store";
import type { LogbookEntry } from "@/lib/logbook/types";
import { buildOrbitItems } from "@/lib/orbit-content";
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
export default async function Home() {
  // Real approved reviews only, same source HomeStrip reads. If the store
  // is not reachable yet (no database configured locally), the orbit just
  // carries fewer cards rather than inventing a reviewer.
  let approvedReviews: LogbookEntry[] = [];
  try {
    approvedReviews = await getStore().list({ status: "approved" });
  } catch (e) {
    console.error("orbit reviews fetch failed", e);
  }
  const orbitItems = buildOrbitItems(approvedReviews);
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const featuredFrames = galleryPhotos.filter((g) => g.featured);
  const frames = (featuredFrames.length >= 6 ? featuredFrames : galleryPhotos).slice(0, 9);

  return (
    <div className={`descent ${archivo.variable} ${plex.variable}`}>
      <span data-sc-progress />
      <div className="sc-grain" aria-hidden="true" />
      <DescentNav whatsapp={WHATSAPP} />
      <aside className="hud mono" id="hud" aria-hidden="true">
        <span className="hud__depth"><span id="hud-depth">00.0</span> <small>M</small></span>
        <span className="hud__label" id="hud-label">Surface</span>
        <span className="hud__track"><i id="hud-track" /></span>
      </aside>

      <main id="descent-main">
        {/* ACT 0 · SURFACE: his name and his face, before the descent begins. Real
            photo (public/images/OsamaDives.png, Osama teaching a student in the
            shallows), the same one live on the current production hero, at
            Hesham's request 4 Sep 2026: "his face is the branding." */}
        <section className="g-abyss brand-act" id="brand-act">
          <div className="brand-stage">
            <img className="brand-stage__photo" data-sc-parallax="-0.12" src="/images/osama-brand-hero.webp" srcSet="/images/osama-brand-hero-m.webp 800w, /images/osama-brand-hero.webp 1600w" sizes="100vw" alt="Osama teaching a diving student in the crystal-clear shallow water of Dahab, Egypt" />
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="brand-copy" data-sc-in>
              <h1>Osama.</h1>
              <p className="sc-body">PADI Master Scuba Diver Trainer. Fourth family in Dahab, on this shore since 1983.</p>
              <div className="brand-ribbons">
                <LogbookRibbon variant="hero" />
                <AiFeatureRibbon variant="hero" />
                <InstagramRibbon variant="hero" />
              </div>
            </div>
          </div>
        </section>

        {/* ACT 1 · ENTRY: the sea, scrubbing under the wheel from the first pixel */}
        <section className="g-abyss" id="entry-act" data-sc-act="scrub" data-sc-span="2.3" style={{ "--sc-span": 2.3 } as React.CSSProperties} data-sc-dwell="0.35">
          <div data-sc-stage>
            <img className="sc-stage__poster" data-sc-parallax="-0.22" src="/descent/hero-poster.webp" srcSet="/descent/hero-poster-m.webp 800w, /descent/hero-poster.webp 1600w" sizes="100vw" alt="" />
            <video data-sc-scrub data-sc-parallax="-0.22" data-sc-src="/descent/hero.mp4" data-sc-src-mobile="/descent/hero-m.mp4" muted playsInline />
            <Bubbles count={36} strength={1} />
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="copy-scrim" aria-hidden="true" />
            <div className="sea-scrim-m" aria-hidden="true" />
            <div className="sc-copy sc-copy--lead entry-copy" data-sc-cue="0 0.85 0">
              <span className="microcopy">Dive log · Dahab, South Sinai · kept since 1983</span>
              <h2>The sea took him in.</h2>
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
        <section className="g-bone" id="guide-act" data-sc-act="pin" data-sc-span="2.1" style={{ "--sc-span": 2.1 } as React.CSSProperties} data-sc-spotlight>
          <div data-sc-stage className="guide-stage">
            <img className="guide-back" data-sc-parallax="-0.32" src="/descent/arch-camels.webp" alt="" aria-hidden="true" />
            <div className="guide-cover">
              <div className="guide-panel glass glass--paper" data-sc-parallax="0.05">
                <div className="rule-draw" aria-hidden="true" />
                <span className="microcopy">On the sand · your guide</span>
                <h2 data-sc-cue="0 1 0 0.1" data-sc-kinetic="lines">Meet Osama.</h2>
                <p className="sc-body" data-sc-cue="0.06 1 0.12 0.1">Osama Mohamed Hassan was born into a Dahab of fishing boats and palm shelters on the sand. He has spent his life in this water. He briefs slowly, watches closely, and laughs easily.</p>
                <dl className="ledger" data-sc-cue="0.12 1 0.14 0.1">
                  <div><dt>Rating</dt><dd>PADI Master Scuba Diver Trainer</dd></div>
                  <div><dt>Family</dt><dd>Fourth family of Dahab, on this shore since 1983</dd></div>
                  <div><dt>The kitchen</dt><dd>Shark Restaurant, open since the family arrived</dd></div>
                  <div><dt>Teaches</dt><dd>First breath to first professional step</dd></div>
                </dl>
              </div>
              <div className="guide-plate" data-sc-parallax="-0.06">
                <span className="exhibit-letter" aria-hidden="true" data-sc-parallax="-0.7">O</span>
                <figure data-sc-reveal="down" data-sc-reveal-at="0.02 0.4" data-sc-tilt="5">
                  <img src="/descent/osama-portrait.webp" srcSet="/descent/osama-portrait-m.webp 800w, /descent/osama-portrait.webp 960w" sizes="(max-width: 860px) 92vw, 45vw" width={960} height={956} alt="Osama in his wetsuit on the shore at Dahab, checking his regulator, Sinai mountains behind him" />
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
        <section className="g-night" id="peak-act" data-sc-act="pin" data-sc-span="2.9" style={{ "--sc-span": 2.9 } as React.CSSProperties}>
          <div data-sc-stage className="peak-stage">
            <div className="peak-year sc-nums" data-sc-count="1987 2026" data-sc-count-at="0.1 0.8" data-sc-parallax="-1" aria-hidden="true">1987</div>
            <div className="peak-frame" data-sc-parallax="0.35">
              <div className="peak-mat">
                <div className="peak-plate">
                  <img src="/descent/peak-1987.webp" srcSet="/descent/peak-1987-m.webp 800w, /descent/peak-1987.webp 1400w" sizes="(max-width: 860px) 92vw, 78vw" width={1400} height={933} alt="A scratched family photograph from August 1987: four young people arm in arm on the Dahab shore beside an orange Bedouin truck" />
                  <img className="now" src="/descent/peak-now.webp" srcSet="/descent/peak-now-m.webp 800w, /descent/peak-now.webp 1400w" sizes="(max-width: 860px) 92vw, 78vw" width={1400} height={933} alt="Osama on the same shore years later, in his wetsuit before a dive, the sea on his left and the Sinai mountains behind" />
                </div>
              </div>
              <div className="peak-captions">
                <p data-sc-cue="0 0.46 0 0.1">The shore at Assalah · August 1987 · from the family album</p>
                <p data-sc-cue="0.5 1 0.1 0.08">The same shore, decades on · Osama before a morning dive</p>
              </div>
            </div>
          </div>
        </section>

        {/* BRIDGE · the seam between the print and the sea carries one line */}
        <section className="g-abyss silence" style={{ minHeight: "34vh" }}>
          <span className="microcopy" data-sc-in>Stop 2 · the sites</span>
          <p className="line" data-sc-in>From the sand, straight into the sea.</p>
        </section>

        {/* ACT 4b · THE DESCENT: three of Osama's own photographs, shown at the depth they were taken.
            The dive computer reads those depths, nothing invented. */}
        <section className="g-abyss" id="descent-act" data-sc-act="pin" data-sc-span="3.2" style={{ "--sc-span": 3.2 } as React.CSSProperties}>
          <div data-sc-stage className="depth-stage">
            <img className="depth-photo depth-photo--1" data-sc-parallax="-0.24" src="/descent/depth-7.webp" srcSet="/descent/depth-7-m.webp 800w, /descent/depth-7.webp 1600w" sizes="100vw" alt="A turtle over the reef at Om El Seed, seven metres down, photographed by Osama" />
            <img className="depth-photo depth-photo--2" data-sc-parallax="-0.24" src="/descent/depth-8.webp" srcSet="/descent/depth-8-m.webp 800w, /descent/depth-8.webp 1600w" sizes="100vw" alt="Coral on the reef shelf at the edge of the Blue Hole, eight metres down, photographed by Osama" />
            <img className="depth-photo depth-photo--3" data-sc-parallax="-0.24" src="/descent/depth-12.webp" srcSet="/descent/depth-12-m.webp 800w, /descent/depth-12.webp 1600w" sizes="100vw" alt="A diver silhouetted in open blue water at twelve metres, photographed by Osama" />
            <Bubbles count={22} strength={0.7} />
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="depth-copy">
              <div className="depth-cue" data-sc-cue="0.02 0.3 0.08 0.06">
                <span className="microcopy">7 metres · Om El Seed</span>
                <h2>A turtle that does not hurry.</h2>
              </div>
              <div className="depth-cue" data-sc-cue="0.36 0.64 0.06 0.06">
                <span className="microcopy">8 metres · the edge of the Blue Hole</span>
                <h2>The reef shelf, where the Blue Hole begins.</h2>
              </div>
              <div className="depth-cue" data-sc-cue="0.7 1 0.06 0">
                <span className="microcopy">12 metres · the blue</span>
                <h2>Into the blue, within your training, every time.</h2>
              </div>
            </div>
            <div className="depth-credit microcopy" data-sc-cue="0.05">Photographs by Osama, on ordinary working days</div>
          </div>
        </section>

        {/* ACT 5 · THE COAST: lateral travel, south to north, five real dives */}
        <section className="g-abyss" id="coast-act" data-sc-act="pan" data-sc-span="3.5" style={{ "--sc-span": 3.5 } as React.CSSProperties}>
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
                <img className="station__img" src="/descent/sea-poster-m.webp" alt="" />
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
              <figure className="station-img" data-sc-parallax="-0.5">
                <img src="/descent/sea-poster.webp" srcSet="/descent/sea-poster-m.webp 800w, /descent/sea-poster.webp 1600w" sizes="(max-width: 860px) 74vw, 22rem" alt="A coral-crusted pillar rising from the sea floor at Dahab, a diver hovering beside it" />
                <figcaption>The reef, on an ordinary morning</figcaption>
              </figure>
              <a className="station" href="/dive-sites/the-canyon-dahab" data-sc-tilt="4">
                <span className="microcopy">North of town</span>
                <h3>The Canyon</h3>
                <span className="depth mono">10-30 <small>M</small></span>
                <p>A rift in the reef lit by shafts of sun, full of glassfish. Advanced, properly briefed.</p>
              </a>
              <a className="station" href="/dive-sites/blue-hole-dahab" data-sc-tilt="4">
                <img className="station__img" src="/descent/depth-8-m.webp" alt="" />
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

        {/* ACT 5b · WHY DAHAB: the three reasons, in his words, carried over from the
            previous homepage so nothing is lost. */}
        <section className="g-bone" id="why-act" data-sc-act="flow">
          <div className="school why">
            <div className="school-head" data-sc-in data-sc-stagger="60">
              <span className="microcopy">Why here</span>
              <h2>Why divers dream of Dahab.</h2>
              <p className="sc-body">Clear Red Sea water, world-class sites, and a shore you walk into. No boat, no seasickness, no rush.</p>
            </div>
            <div className="exhibits exhibits--three" data-sc-in data-sc-stagger="90">
              <figure className="exhibit">
                <span className="letter" aria-hidden="true" data-sc-parallax="-0.4">B</span>
                <a className="exhibit-card" href="/dive-sites/blue-hole-dahab" data-sc-tilt="5" data-sc-parallax="-0.08">
                  <img src="/images/OsamaDives_The_Blue_Hole.jpeg" alt="The Blue Hole in Dahab, the famous vertical drop with the Arch at 55 metres" loading="lazy" />
                  <div className="row"><h3>Blue Hole</h3><span className="spec">A pilgrimage</span></div>
                  <p>Divers travel from every corner of the world to descend into this sinkhole. Open Water is the minimum. The Arch is for technical divers only; recreational diving here stops at 40 metres. I have dived it more than a thousand times. I know its moods, and how to show you its magic safely.</p>
                </a>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true" data-sc-parallax="-0.4">C</span>
                <a className="exhibit-card" href="/dive-sites/the-canyon-dahab" data-sc-tilt="5" data-sc-parallax="0.06">
                  <img src="/images/OsamDives_The_Canyon.jpg" alt="The Canyon dive site in Dahab, dramatic formations with shafts of light" loading="lazy" />
                  <div className="row"><h3>The Canyon</h3><span className="spec">A cathedral</span></div>
                  <p>You descend through a narrow passage as beams of sunlight pierce the water above you. Walls covered in soft coral, home to lionfish, moray eels, and schools of glassfish.</p>
                </a>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true" data-sc-parallax="-0.4">S</span>
                <a className="exhibit-card" href="/dive-sites" data-sc-tilt="5" data-sc-parallax="-0.08">
                  <img src="/images/FB_IMG_1621238990084.jpg" alt="Shore diving in Dahab, an easy beach entry with no boats" loading="lazy" />
                  <div className="row"><h3>Shore diving</h3><span className="spec">No boats</span></div>
                  <p>Forget crowded boats and rough seas. In Dahab you walk to your dive site. Gear up on the beach, wade in through calm water, and you are diving within minutes. More time underwater, less time commuting.</p>
                </a>
              </figure>
            </div>
          </div>
        </section>

        {/* ACT 5c · THE JOURNAL: his stories, a rail that pans as the visitor scrolls */}
        <section className="g-night" id="journal-act" data-sc-act="pan" data-sc-span="2.6" style={{ "--sc-span": 2.6 } as React.CSSProperties}>
          <div data-sc-stage>
            <div className="coast-rail journal-rail" data-sc-pan="0.05">
              <div className="coast-lead">
                <span className="microcopy">The journal</span>
                <h2>Stories from the water.</h2>
                <p className="sc-body">A thousand dives at one site, why I teach, what the night does to a reef. Written by me, between dives.</p>
                <a className="cta cta--quiet" href="/blog">Read the journal</a>
              </div>
              {posts.map((post) => (
                <a className="station journal-card" href={`/blog/${post.slug}`} key={post.slug} data-sc-tilt="4">
                  <img className="station__img" src={post.featuredImage} alt="" loading="lazy" />
                  <span className="microcopy">{new Date(post.date).getFullYear()} · journal</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ACT 6 · HIS WORLD: Osama at the centre, a 3D ring of the site's own sites,
            stories, gallery and reviews orbiting him. Sits here because by this point
            the visitor has met him (the guide), seen the depths and toured the sites;
            this is the "everything he's built" beat before the school closes the dive. */}
        <section className="g-lagoon" id="orbit-act" data-sc-act="pin" data-sc-span="2.6" style={{ "--sc-span": 2.6 } as React.CSSProperties}>
          <div data-sc-stage className="orbit-stage">
            <div className="orbit-head">
              <span className="microcopy">9 m · his world</span>
              <h2 data-sc-cue="0 1 0 0.1" data-sc-kinetic="lines">Everything he has built around him.</h2>
              <p className="orbit-tagline">Dive sites, stories, and reviews, one turn at a time.</p>
            </div>
            <OrbitScene items={orbitItems} osamaSrc="/descent/osama-cutout.webp" osamaSrcMobile="/descent/osama-cutout-m.webp" osamaAlt="Osama, cut out in his dive gear" />
          </div>
        </section>

        {/* ACT 7 · THE SCHOOL: courses mounted as exhibits */}
        <section className="g-bone" id="school-act" data-sc-act="flow">
          <div className="school">
            <div className="school-head" data-sc-in data-sc-stagger="60">
              <span className="microcopy">Safety stop · 5 metres · the school</span>
              <h2>Learn it properly.</h2>
              <p className="sc-body">Small groups, slow briefings, the same reef he learned on. Pick the course that matches where you are, and he takes you the rest of the way.</p>
            </div>
            <div className="exhibits" data-sc-in data-sc-stagger="90">
              <figure className="exhibit">
                <span className="letter" aria-hidden="true" data-sc-parallax="-0.4">I</span>
                <div className="exhibit-card" data-sc-tilt="5" data-sc-parallax="-0.08">
                  <img src="/descent/arch-lagoon.webp" srcSet="/descent/arch-lagoon-m.webp 800w, /descent/arch-lagoon.webp 1400w" sizes="(max-width: 860px) 92vw, 40vw" alt="The turquoise lagoon at Dahab where first dives happen" />
                  <div className="row"><h3>Intro Dive</h3><span className="spec">Half a day</span></div>
                  <p>Never tried it. A pool, then the sea, no certification, just a first breath underwater.</p>
                </div>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true" data-sc-parallax="-0.4">O</span>
                <div className="exhibit-card" data-sc-tilt="5" data-sc-parallax="0.06">
                  <img src="/descent/padi-first-fins.webp" alt="A young student in a small wetsuit standing proudly in the street at Assalah" />
                  <div className="row"><h3>Open Water</h3><span className="spec">3-4 days · 18 m</span></div>
                  <p>The certification. You leave able to dive anywhere in the world.</p>
                </div>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true" data-sc-parallax="-0.4">A</span>
                <div className="exhibit-card" data-sc-tilt="5" data-sc-parallax="-0.08">
                  <img src="/descent/bluehole-aerial.webp" alt="The Blue Hole of Dahab seen from above, a deep blue circle in the reef shelf" />
                  <div className="row"><h3>Advanced</h3><span className="spec">2 days · 30 m</span></div>
                  <p>Five adventure dives. Opens the deep sites, night diving included.</p>
                </div>
              </figure>
              <figure className="exhibit">
                <span className="letter" aria-hidden="true" data-sc-parallax="-0.4">R</span>
                <div className="exhibit-card" data-sc-tilt="5" data-sc-parallax="0.06">
                  <img src="/descent/osama-truck.webp" srcSet="/descent/osama-truck-m.webp 800w, /descent/osama-truck.webp 960w" sizes="(max-width: 860px) 92vw, 40vw" alt="Osama on the back of a pickup truck in his wetsuit after a dive, talking to divers" />
                  <div className="row"><h3>Rescue Diver</h3><span className="spec">4 days</span></div>
                  <p>The course that turns you into a buddy worth diving with.</p>
                </div>
              </figure>
            </div>
            <dl className="school-more" data-sc-in>
              <div><dt>Divemaster</dt><dd>Several weeks at his side. The first professional step, if you want one.</dd></div>
              <div><dt>Specialties</dt><dd>Sidemount, nitrox, deep, night. Picked to fit the reefs you want to dive.</dd></div>
              <div><dt>The Blue Hole</dt><dd>A half day at the famous one. Open Water at minimum, 40 metres at most; the Arch stays with the technical divers.</dd></div>
              <div><dt>Ras Abu Galum safari</dt><dd>By camel through bronze canyons to reefs no speedboat reaches. Advanced divers, and snorkellers with a private guide, always accompanied.</dd></div>
            </dl>
            <p className="school-note" data-sc-in>Interested in any of these? I am happy to share recommendations and to connect you with CDWS-registered dive centres in Dahab.</p>
          </div>
        </section>

        {/* ACT 7b · THE GALLERY: a rail of his photographs, panning as the visitor scrolls */}
        <section className="g-abyss" id="gallery-act" data-sc-act="pan" data-sc-span="2.8" style={{ "--sc-span": 2.8 } as React.CSSProperties}>
          <div data-sc-stage>
            <div className="coast-rail gal-rail" data-sc-pan="0.05">
              <div className="coast-lead">
                <span className="microcopy">The gallery</span>
                <h2>Forty years of photographs.</h2>
                <p className="sc-body">Students, reefs, the family, the town. The whole archive is on the gallery page; this is a walk past a few frames.</p>
                <a className="cta cta--quiet" href="/gallery">Open the gallery</a>
              </div>
              {frames.map((photo, i) => (
                <a className={`gal-frame gal-frame--${i % 3}`} href="/gallery" key={photo.id} data-sc-tilt="3" data-sc-parallax={i % 2 ? "-0.18" : "0.12"}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <figcaption className="microcopy">{photo.title}</figcaption>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ACT 8 · SURFACING: the camera breaks the surface, the gauge reads zero */}
        <section className="g-abyss" id="surface-act" data-sc-act="scrub" data-sc-span="1.4" style={{ "--sc-span": 1.4 } as React.CSSProperties} data-sc-dwell="0.3">
          <div data-sc-stage>
            <img className="sc-stage__poster" data-sc-parallax="-0.22" src="/descent/surface-poster.webp" srcSet="/descent/surface-poster-m.webp 800w, /descent/surface-poster.webp 1600w" sizes="100vw" alt="" />
            <video data-sc-scrub data-sc-parallax="-0.22" data-sc-src="/descent/surface.mp4" data-sc-src-mobile="/descent/surface-m.mp4" muted playsInline />
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="copy-scrim" aria-hidden="true" />
            <div className="sea-scrim-m" aria-hidden="true" />
            <div className="sc-copy sc-copy--lead surface-copy" data-sc-cue="0.05">
              <h2>Come up when you&apos;re ready.</h2>
              <p className="sc-body">Send a message and start planning your water. He answers himself.</p>
              <a className="cta" data-sc-magnet="0.26" data-sc-rise="0" href={WHATSAPP} target="_blank" rel="noopener noreferrer">Message Osama</a>
              <p className="surface-small">WhatsApp is the fastest way. I usually answer within a few hours. If you would rather talk, <a href="https://cal.com/osama-dives" target="_blank" rel="noopener noreferrer">pick a time</a>.</p>
              <p className="surface-small">I dive with, and refer to, CDWS-registered dive centres in Dahab.</p>
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
            <a href="/logbook">Reviews</a>
            <a href="/featured/chatgpt">Featured</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </nav>
        </footer>
      </div>
      <BackToTop />
      <DescentBoot />
    </div>
  );
}
