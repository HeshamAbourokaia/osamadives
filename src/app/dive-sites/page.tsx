import Image from "next/image";
import BackToPlace from "@/components/BackToPlace";
import Link from "next/link";
import { diveSites } from "@/lib/dive-sites";

export default function DiveSitesPage() {
  return (
    <div className="min-h-screen bg-white">
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
            <span className="text-white/60 text-sm hidden sm:inline">
              - Dahab Since 1983
            </span>
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
      <header className="pt-28 pb-12 px-4 bg-gradient-to-b from-[#5a5f4e] to-[#6a6f5e]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "serif" }}>
            Dive Sites in Dahab
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Dahab sits on the Red Sea coast of South Sinai, Egypt - a small town with some of the most varied dive sites in the world. World-famous walls, shallow reef gardens, dramatic underwater canyons, and a sinkhole that has called divers from every continent for forty years.
          </p>
          <p className="text-base text-white/75 max-w-3xl mx-auto mt-4">
            Each guide below is from my own experience diving these sites - the safe routes, the depths, the marine life, the best time to dive. I lead all of these with PADI students and certified divers from every level.
          </p>
        </div>
      </header>

      {/* Dive Sites Grid */}
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {diveSites.map((site) => (
              <article
                key={site.slug}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group border border-gray-100"
              >
                <Link href={`/dive-sites/${site.slug}`}>
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={site.featuredImage}
                      alt={site.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded">
                        {site.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#5a5f4e] transition-colors">
                      {site.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {site.tagline}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{site.depthMin}-{site.depthMax}m</span>
                      <span>&middot;</span>
                      <span>{site.distanceFromDahab}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-[#5a5f4e]/10 via-[#5a5f4e]/5 to-[#5a5f4e]/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Want to dive these sites?</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              I take guests to all of these sites - from first-time divers to technical divers training for the Blue Hole arch. Reach out and let me know what you are after.
            </p>
            <a
              href="https://wa.me/201090208050?text=Hi%20Osama!%20I%20saw%20your%20dive%20sites%20page%20and%20would%20love%20to%20chat%20about%20diving%20in%20Dahab!"
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
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white font-bold text-2xl">OsamaDives</span>
            <span className="text-gray-500 text-sm">- Since 1983</span>
          </div>
          <p className="text-sm mb-4 max-w-xl mx-auto">
            Diving sites of Dahab, written from my own logbook. Every reef I describe, I have dived hundreds of times.
          </p>
          <div className="border-t border-gray-800 pt-6 text-sm">
            <p>&copy; 2026 OsamaDives.com - Dahab, Egypt</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/" className="text-[#5a5f4e] hover:underline">Home</Link>
              <Link href="/blog" className="text-[#5a5f4e] hover:underline">Journal</Link>
              <Link href="/gallery" className="text-[#5a5f4e] hover:underline">Gallery</Link>
            </div>
          </div>
        </div>
      </footer>
      <BackToPlace />
    </div>
  );
}
