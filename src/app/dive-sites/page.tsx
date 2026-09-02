import Image from "next/image";
import Link from "next/link";
import { diveSites } from "@/lib/dive-sites";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function DiveSitesPage() {
  return (
    <main className="bg-bone text-abyss">
      <TopNav forceSolid />

      <header className="bg-abyss text-white pt-32 pb-20 px-5 sm:px-10">
        <div className="max-w-editorial mx-auto">
          <p className="label-eyebrow text-sun-glint mb-6">The reefs</p>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.02] max-w-3xl mb-6">
            Dive sites of Dahab.
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Each guide is from my own logbook. Every reef described below, I
            have dived hundreds of times.
          </p>
        </div>
      </header>

      <section className="py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-editorial mx-auto">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {diveSites.map((site) => (
              <article key={site.slug} className="group">
                <Link href={`/dive-sites/${site.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-abyss/10 mb-5">
                    <Image
                      src={site.featuredImage}
                      alt={site.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 text-xs font-mono uppercase tracking-widest text-white">
                      {site.level}
                    </span>
                  </div>
                  <p className="label-eyebrow text-reef mb-2">
                    {site.depthMin} to {site.depthMax}m. {site.distanceFromDahab}.
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl text-abyss group-hover:text-reef transition-colors mb-2">
                    {site.name}
                  </h2>
                  <p className="text-abyss/70 leading-relaxed line-clamp-3">
                    {site.tagline}
                  </p>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-24 pt-12 border-t border-abyss/15 max-w-2xl mx-auto text-center">
            <p className="font-display text-3xl text-abyss leading-snug mb-6">
              Want to dive any of these with me?
            </p>
            <a
              href="https://wa.me/201090208050?text=Hi%20Osama!%20I%20saw%20your%20dive%20sites%20page%20and%20would%20love%20to%20chat."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-reef hover:bg-reef/90 text-white px-7 py-4 rounded-full text-base font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message me on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
