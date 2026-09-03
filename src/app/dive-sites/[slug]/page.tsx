import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { diveSites, getDiveSiteBySlug } from "@/lib/dive-sites";

export function generateStaticParams() {
  return diveSites.map((s) => ({ slug: s.slug }));
}

export default function DiveSiteDetailPage({ params }: { params: { slug: string } }) {
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

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#5a5f4e]/95 backdrop-blur-sm"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-white font-bold text-xl group-hover:text-white/90 transition">
              OsamaDives
            </span>
            <span className="text-white/60 text-sm hidden sm:inline">- Dahab Since 1983</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-white/90">
            <Link href="/#why-dahab" className="hover:text-white transition">Why Dahab</Link>
            <Link href="/dive-sites" className="text-white font-semibold">Dive Sites</Link>
            <Link href="/gallery" className="hover:text-white transition">Gallery</Link>
            <Link href="/blog" className="hover:text-white transition">Journal</Link>
            <Link
              href="/#contact"
              className="bg-white text-[#5a5f4e] px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-[55vh] min-h-[420px] mt-14">
        <Image
          src={site.featuredImage}
          alt={site.imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/dive-sites"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-medium py-2 px-4 rounded-full transition border border-white/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Dive Sites
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full mb-4">
              {site.level} &middot; {site.depthMin}-{site.depthMax}m
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "serif" }}>
              {site.name}
            </h1>
            <p className="text-white/90 text-lg max-w-3xl">{site.tagline}</p>
          </div>
        </div>
      </header>

      <main className="py-12 px-4">
        <article className="max-w-3xl mx-auto">
          {/* Quick facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-6 bg-[#5a5f4e]/5 rounded-xl">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Depth</p>
              <p className="font-semibold text-gray-900">{site.depthMin}-{site.depthMax}m</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Level</p>
              <p className="font-semibold text-gray-900">{site.level}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Distance</p>
              <p className="font-semibold text-gray-900">{site.distanceFromDahab}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Best for</p>
              <p className="font-semibold text-gray-900 text-sm">{site.bestFor[0]}</p>
            </div>
          </div>

          {/* Long description */}
          <div className="prose prose-lg max-w-none">
            {site.longDescription.map((para, i) => (
              <p key={i} className="mb-6 text-gray-700 leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </div>

          {/* Marine life + best-for grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">What you might see</h2>
              <ul className="space-y-1.5 text-gray-700">
                {site.marineLife.map((m) => (
                  <li key={m} className="text-sm">- {m}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Best for</h2>
              <ul className="space-y-1.5 text-gray-700">
                {site.bestFor.map((b) => (
                  <li key={b} className="text-sm">- {b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 bg-[#5a5f4e]/5 rounded-xl">
            <p className="text-gray-700 mb-4">
              Want to dive {site.shortName} with me? Send me a message and I will set it up - whether you are a first-time diver or an experienced one looking for a guide who knows the site cold.
            </p>
            <a
              href={`https://wa.me/201090208050?text=Hi%20Osama!%20I%20want%20to%20dive%20${encodeURIComponent(site.shortName)}%20with%20you.%20Tell%20me%20more!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="max-w-6xl mx-auto mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Other Sites in Dahab</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <article key={r.slug} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                  <Link href={`/dive-sites/${r.slug}`}>
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={r.featuredImage}
                        alt={r.imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#5a5f4e] transition-colors">
                        {r.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.tagline}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="py-16 px-4 bg-[#061420] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-[#3FD1BE] mb-3">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dived here with me?</h2>
            <p className="text-white/75 mb-8 max-w-xl mx-auto">
              Every review becomes a page in my logbook, signed by me. Write yours from this dive.
            </p>
            <Link
              href={`/logbook?site=${params.slug}#sign`}
              className="inline-block bg-[#3FD1BE] hover:bg-[#5fe0cf] text-[#04121A] font-bold px-8 py-4 rounded-full transition-colors"
            >
              Write me a review
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white font-bold text-2xl">OsamaDives</span>
            <span className="text-gray-500 text-sm">- Since 1983</span>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm">
            <p>&copy; 2026 OsamaDives.com - Dahab, Egypt</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/" className="text-[#5a5f4e] hover:underline">Home</Link>
              <Link href="/dive-sites" className="text-[#5a5f4e] hover:underline">Dive Sites</Link>
              <Link href="/blog" className="text-[#5a5f4e] hover:underline">Journal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
