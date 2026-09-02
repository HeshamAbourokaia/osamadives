import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { diveSites, getDiveSiteBySlug } from "@/lib/dive-sites";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export function generateStaticParams() {
  return diveSites.map((s) => ({ slug: s.slug }));
}

export default function DiveSiteDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const site = getDiveSiteBySlug(params.slug);
  if (!site) notFound();

  const related = diveSites.filter((s) => s.slug !== site.slug).slice(0, 3);

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: site.name,
    description: site.description,
    image: `https://www.osamadives.com${site.featuredImage}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dahab",
      addressRegion: "South Sinai",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.4895,
      longitude: 34.5132,
    },
    isAccessibleForFree: false,
    publicAccess: true,
    touristType: ["Scuba divers", "Snorkellers", "PADI students"],
  };

  const whatsappHref = `https://wa.me/201090208050?text=${encodeURIComponent(
    `Hi Osama! I want to dive ${site.shortName} with you. Tell me more.`
  )}`;

  return (
    <main className="bg-bone text-abyss">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <TopNav />

      {/* 1. Cinematic header */}
      <header className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-abyss">
        <Image
          src={site.featuredImage}
          alt={site.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/55 via-abyss/30 to-abyss" />
        <div className="absolute inset-x-0 bottom-0 px-5 sm:px-10 pb-16">
          <div className="max-w-editorial mx-auto text-white">
            <Link
              href="/dive-sites"
              className="inline-flex items-center gap-2 mb-8 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              All reefs
            </Link>
            <p className="label-eyebrow text-sun-glint mb-6">
              {site.level}. {site.depthMin} to {site.depthMax} metres.
            </p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.02] mb-6 max-w-4xl">
              {site.name}.
            </h1>
            <p className="text-white/85 text-lg sm:text-xl max-w-2xl leading-relaxed">
              {site.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* 2. Quick facts strip */}
      <section className="bg-abyss text-white px-5 sm:px-10 py-12 border-b border-white/8">
        <div className="max-w-editorial mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
          <Fact label="Depth" value={`${site.depthMin} to ${site.depthMax}m`} />
          <Fact label="Level" value={site.level} />
          <Fact label="Distance" value={site.distanceFromDahab} />
          <Fact label="Best for" value={site.bestFor[0]} />
        </div>
      </section>

      {/* 3. Long description */}
      <section className="bg-bone py-24 sm:py-32 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="label-eyebrow text-reef mb-8">In my own words</p>
          {site.longDescription.map((para, i) => (
            <p
              key={i}
              className={`leading-relaxed text-abyss/85 ${
                i === 0
                  ? "font-display text-2xl sm:text-3xl text-abyss mb-10 leading-snug"
                  : "text-lg mb-7"
              }`}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* 4. Marine life + best for, editorial two-up */}
      <section className="bg-bone pb-24 sm:pb-32 px-5 sm:px-10">
        <div className="max-w-editorial mx-auto grid md:grid-cols-2 gap-10">
          <div className="border-t border-abyss/15 pt-8">
            <p className="label-eyebrow text-reef mb-6">What you might see</p>
            <ul className="space-y-3 text-abyss/80 text-lg">
              {site.marineLife.map((m) => (
                <li key={m} className="flex items-baseline gap-3">
                  <span className="text-reef text-xs font-mono">/</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-abyss/15 pt-8">
            <p className="label-eyebrow text-reef mb-6">Best for</p>
            <ul className="space-y-3 text-abyss/80 text-lg">
              {site.bestFor.map((b) => (
                <li key={b} className="flex items-baseline gap-3">
                  <span className="text-reef text-xs font-mono">/</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Safety/compliance reminder, mainly for Blue Hole */}
      {site.slug === "blue-hole-dahab" && (
        <section className="bg-abyss text-white px-5 sm:px-10 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="label-eyebrow text-sun-glint mb-6">A reminder</p>
            <p className="font-display text-2xl sm:text-3xl leading-snug mb-6">
              Anyone diving the Blue Hole must have at least an Open Water
              certification.
            </p>
            <p className="text-white/75 leading-relaxed text-lg">
              The Arch is strictly for Technical Divers. Recreational diving
              here is limited to a maximum depth of 40 meters. Twenty logged
              dives required for guided dives, and I am strict on it.
            </p>
          </div>
        </section>
      )}

      {/* 6. CTA section */}
      <section className="bg-bone px-5 sm:px-10 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-3xl sm:text-4xl text-abyss leading-snug mb-8">
            Want to dive {site.shortName} with me?
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-reef hover:bg-reef/90 text-white px-7 py-4 rounded-full text-base font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message me on WhatsApp
          </a>
        </div>
      </section>

      {/* 7. Related */}
      {related.length > 0 && (
        <section className="bg-abyss text-white px-5 sm:px-10 py-24">
          <div className="max-w-editorial mx-auto">
            <p className="label-eyebrow text-sun-glint mb-4">Keep exploring</p>
            <h2 className="font-display text-3xl sm:text-5xl leading-[1.05] mb-12 max-w-2xl">
              Other reefs I dive often.
            </h2>
            <div className="grid md:grid-cols-3 gap-7">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/dive-sites/${r.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4 bg-abyss">
                    <Image
                      src={r.featuredImage}
                      alt={r.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent to-transparent" />
                  </div>
                  <p className="label-eyebrow text-sun-glint/70 mb-2">
                    {r.level}. {r.depthMin} to {r.depthMax}m.
                  </p>
                  <p className="font-display text-2xl text-white group-hover:text-sun-glint transition-colors">
                    {r.shortName}
                  </p>
                  <p className="text-sm text-white/55 mt-1">{r.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Footer */}
      <Footer />
      <FloatingWhatsApp context={`I want to dive ${site.shortName} with you.`} />
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-eyebrow text-white/45 mb-2">{label}</p>
      <p className="font-display text-xl">{value}</p>
    </div>
  );
}
