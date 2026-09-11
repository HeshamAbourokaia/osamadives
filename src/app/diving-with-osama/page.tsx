import DescentShell from "@/app/DescentShell";
import PickButton from "@/app/PickButton";
import CourseFinder from "@/app/CourseFinder";
import DayStrip from "@/app/DayStrip";
import WhenToCome from "@/app/WhenToCome";
import { WHATSAPP } from "@/lib/contact";

export const metadata = {
  title: "Diving with Osama | PADI Master Scuba Diver Trainer in Dahab",
  description:
    "Osama, a PADI Master Scuba Diver Trainer in Dahab, on the training he runs and what a day in the water is like. Instruction is arranged through CDWS-registered dive centres in Dahab, South Sinai.",
  alternates: { canonical: "https://www.osamadives.com/diving-with-osama" },
};

/**
 * The page that says plainly what he does. Everything here was already on the site,
 * scattered through the homepage's seventh act; this is the findable version, in his
 * own voice, as a page about a person rather than a list of things to buy. The one
 * statement about the centres sits high, where it governs the whole page, and is not
 * repeated after every paragraph: the site's foot carries the standing notice on
 * every page, and nothing here is sold, priced or booked.
 */
export default function DivingWithOsamaPage() {
  return (
    <DescentShell>
      <header className="site-head pt-24 pb-12 px-4 bg-gradient-to-b from-[#061420] to-[#0a2a3a]">
        <div className="max-w-3xl mx-auto text-white">
          <div className="wiw__mark">
            <img src="/brand/stamp-512.png" alt="" width={72} height={72} />
            <p className="wiw__eyebrow">Dahab, South Sinai</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-4">What I do in the water</h1>
          <p className="text-base sm:text-xl text-white/90">
            I have been in this sea since I was a boy, and teaching in it since 2011. It is the part
            of my life people ask about most, so I have written it down here.
          </p>
          <p className="wiw__legal">
            I am not a dive centre and I do not run one. Diving in Egypt is operated by
            CDWS-registered centres, and that is who I work through. The centre arranges the dive and
            holds the permits. I am the instructor in the water with you.
          </p>
        </div>
      </header>

      <main className="wiw">
        <div className="only-mobile"><CourseFinder /><WhenToCome /></div>
        <section>
          <h2>Where people start</h2>
          <p className="wiw__lead">Most of the people I take into the water have never breathed underwater before.</p>
          <dl className="wiw__list">
            <div>
              <dt>An intro dive</dt>
              <PickButton className="only-mobile" id="course:intro-dive" label="Intro dive" kind="course" />
              <dd>
                <span className="wiw__meta">Half a day · the Lighthouse · no experience needed</span>
                A shallow, sheltered entry at the Lighthouse, the authorised spot in town. No
                certification, just a first breath underwater. The water is confined and easy, but do
                not let that fool you: the fish and the coral are right there. It is how you find out
                whether you love this before you give it any more of your time.
              </dd>
            </div>
            <div>
              <dt>Open Water</dt>
              <PickButton className="only-mobile" id="course:open-water" label="Open Water" kind="course" />
              <dd>
                <span className="wiw__meta">Three to four days · to 18 metres · beginners</span>
                The certification that works anywhere in the world. The real work is not the depth.
                It is handling your equipment, dealing with something going wrong, and finding your
                buoyancy. People leave able to dive, not just able to say they have dived.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2>Who comes with me</h2>
          <dl className="wiw__list">
            <div>
              <dt>People who have never done it</dt>
              <dd>
                Most of them. Nervous is normal and it is not a problem. Small groups, slow
                briefings, and the same reef I learned on. Nobody is going anywhere until they are
                ready.
              </dd>
            </div>
            <div>
              <dt>Children</dt>
              <dd>
                I teach children, and my own son learned in this water. The minimum ages come from the
                training standards and the centre confirms them. What I watch is whether the child is
                comfortable and enjoying it, and I will tell you honestly after the first session.
              </dd>
            </div>
            <div>
              <dt>Divers who are already certified</dt>
              <dd>
                Come and dive. I know where the light is good, where the current turns, and which
                sites are worth the walk on the day you are here.
              </dd>
            </div>
            <div>
              <dt>In English or in Arabic</dt>
              <dd>
                Arabic is my first language. My training and my certifications are in English and I
                teach in it every day, so take whichever you are more comfortable in. Under water it
                is hand signals either way.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2>Where it opens up</h2>
          <dl className="wiw__list">
            <div>
              <dt>Advanced</dt>
              <PickButton className="only-mobile" id="course:advanced" label="Advanced" kind="course" />
              <dd>
                <span className="wiw__meta">Two days · five dives · to 30 metres</span>
                Deep and Underwater Navigation are the two you must do, then three you choose from
                boat, buoyancy, night and fish identification. Navigation is not really about the
                compass. It is learning to read light, current and reef, and keeping the compass as a
                backup. This is also where I teach people to look after the reef they are swimming
                over.
              </dd>
            </div>
            <div>
              <dt>Rescue Diver</dt>
              <PickButton className="only-mobile" id="course:rescue-diver" label="Rescue Diver" kind="course" />
              <dd>
                <span className="wiw__meta">Three to four days · Advanced and 20 logged dives</span>
                Open Water teaches you to look after yourself. Rescue is about everybody else. It
                changes how people see diving. I am strict about the twenty dives, and I do not bend
                it, because competence has to come before the certificate.
              </dd>
            </div>
            <div>
              <dt>Specialties</dt>
              <dd>
                <span className="wiw__meta">Deep · nitrox · night · buoyancy · boat</span>
                Each one sharpens something you already have and opens sites you could not dive
                before. Which ones are worth your time depends entirely on the reefs you want to be
                on, so I would rather talk about that than hand you a list.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2>If you want it to be your work</h2>
          <dl className="wiw__list">
            <div>
              <dt>Divemaster</dt>
              <PickButton className="only-mobile" id="course:divemaster" label="Divemaster" kind="course" />
              <dd>
                <span className="wiw__meta">Two weeks to a month · Rescue certified</span>
                Several weeks at my side. It is the first professional level: leading dives,
                assisting instructors, handling divers of every level. It is a career if you want
                one, and a different way of seeing the same reef either way.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2>Two days out</h2>
          <dl className="wiw__list">
            <div>
              <dt>The Blue Hole</dt>
              <dd>
                <span className="wiw__meta">Half a day · Open Water at minimum · 40 metres at most</span>
                People ask how I am not tired of it after a thousand dives there. It holds more moods
                than the sea has colours. The Arch belongs to the technical divers, and recreational
                diving here stops at forty metres. That is not a preference, it is the rule I dive by.
              </dd>
            </div>
            <div>
              <dt>Ras Abu Galum</dt>
              <dd>
                <span className="wiw__meta">A full day · by camel · Advanced recommended</span>
                Before the trucks and the cars, Bedouins crossed Sinai by camel. The ride goes through
                bronze canyons to reefs no speedboat will ever reach. Snorkellers are welcome with a
                private guide, and the guide stays in the water with you the whole time. Nobody gets
                dropped off.
              </dd>
            </div>
          </dl>
        </section>

        <section className="wiw__end">
          <h2>How it actually happens</h2>
          <div className="only-mobile"><DayStrip /></div>
          <p>
            Message me and tell me what you would like to do and roughly when. I will tell you
            honestly whether it suits you or whether something else would suit you better, and I will
            point you to the centre I would run it through. The paperwork and the arrangements happen
            there.
          </p>
          <a className="wiw__act" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            Message Osama on WhatsApp
          </a>
          <p className="wiw__also">
            If you would rather read first, the <a href="/blog">journal</a> is where I write things
            down, the <a href="/dive-sites">dive sites</a> are described one by one, and the{" "}
            <a href="/gallery">photographs</a> are mine.
          </p>
        </section>
      </main>
    </DescentShell>
  );
}
