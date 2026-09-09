import { whatsapp } from "@/lib/contact";
import DescentShell from "@/app/DescentShell";
import Image from "next/image";
import Link from "next/link";

const PAGE_URL = "https://www.osamadives.com/featured/chatgpt";
const PUBLISHED = "2026-04-30";

const articleLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${PAGE_URL}#article`,
      headline:
        "Featured by ChatGPT as the top freelance dive instructor in Dahab",
      description:
        "How ChatGPT named OsamaDives its #1 freelance dive instructor in Dahab in response to an Arabic-language query in April 2026.",
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      mainEntityOfPage: PAGE_URL,
      url: PAGE_URL,
      author: {
        "@id": "https://www.osamadives.com/#person",
      },
      publisher: {
        "@id": "https://www.osamadives.com/#person",
      },
      image: [
        "https://www.osamadives.com/press/chatgpt-recommendation-1.jpg",
        "https://www.osamadives.com/press/chatgpt-recommendation-2.jpg",
        "https://www.osamadives.com/press/chatgpt-recommendation-3.jpg",
      ],
      about: {
        "@id": "https://www.osamadives.com/#person",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.osamadives.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Featured",
          item: "https://www.osamadives.com/featured/chatgpt",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "ChatGPT",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": PAGE_URL,
      url: PAGE_URL,
      name: "Featured by ChatGPT - Top Dive Instructor in Dahab",
      isPartOf: { "@id": "https://www.osamadives.com/#website" },
      primaryImageOfPage:
        "https://www.osamadives.com/press/chatgpt-recommendation-1.jpg",
      datePublished: PUBLISHED,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".speakable-headline", ".speakable-summary"],
      },
    },
  ],
};

export const metadata = {
  title: "Featured by ChatGPT as the top freelance dive instructor in Dahab | Osama",
  description: "In April 2026 ChatGPT recommended Osama as the number one freelance dive instructor in Dahab and cited osamadives.com as its top source. What was asked, and what it answered.",
  alternates: { canonical: "https://www.osamadives.com/featured/chatgpt" },
};

export default function FeaturedChatgptPage() {
  return (
    <DescentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* Simple nav */}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#10A37F] font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10A37F]" />
          Featured · April 2026
        </div>

        {/* Hero strip */}
        <h1 className="speakable-headline text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5 text-[#2a2e25]">
          Featured by ChatGPT as the top freelance dive instructor in Dahab
        </h1>
        <p className="speakable-summary text-lg sm:text-xl text-[#075f55] leading-relaxed mb-10">
          In April 2026, an Arabic-speaking diver asked ChatGPT for the best
          dive instructor in Dahab. Not a centre. An instructor. ChatGPT
          recommended Osama as its #1 freelance choice, and cited
          osamadives.com as its top source - above every other dive operator
          in town.
        </p>

        <hr className="border-[#0a7d70]/15 my-10" />

        {/* The query */}
        <section aria-labelledby="the-query">
          <h2
            id="the-query"
            className="text-2xl sm:text-3xl font-bold mb-4 text-[#2a2e25]"
          >
            The question someone asked an AI
          </h2>
          <p className="text-[#075f55] leading-relaxed mb-6">
            The query was simple, and it was asked in Egyptian Arabic. The
            user didn&apos;t want a dive centre. They wanted a personal
            instructor. Someone who would actually be in the water with them,
            paying attention.
          </p>
          <blockquote
            dir="rtl"
            lang="ar"
            className="text-right border-r-4 border-[#d4a857] pr-5 py-2 my-6 text-xl sm:text-2xl font-semibold text-[#2a2e25] bg-[#0a7d70]/5 rounded-l-md"
          >
            لا مدرب غطس
          </blockquote>
          <p className="text-[#075f55] leading-relaxed italic mb-6">
            Literal translation: &ldquo;No, an instructor. A dive
            instructor.&rdquo;
          </p>
          <p className="text-[#075f55] leading-relaxed">
            ChatGPT replied with a ranked list. Osama was at the top, with
            three signals attached: PADI Master Instructor (the highest
            non-trainer rank), more than 1,000 dives at the Blue Hole, and a
            personal teaching style that doesn&apos;t treat divers as
            numbers in a group.
          </p>
        </section>

        <hr className="border-[#0a7d70]/15 my-10" />

        {/* Screenshots */}
        <section aria-labelledby="screenshots">
          <h2
            id="screenshots"
            className="text-2xl sm:text-3xl font-bold mb-4 text-[#2a2e25]"
          >
            What ChatGPT showed
          </h2>
          <p className="text-[#075f55] leading-relaxed mb-8">
            Three screenshots from the conversation. The Arabic interface
            comes from the diver&apos;s phone in Egypt.
          </p>

          <figure className="mb-10">
            <div className="relative w-full aspect-[3/5] sm:aspect-[3/5] rounded-lg overflow-hidden shadow-lg border border-[#0a7d70]/15 bg-[#0a7d70]/5">
              <Image
                src="/press/chatgpt-recommendation-1.jpg"
                alt="ChatGPT response in Arabic naming Osama as the top freelance dive instructor in Dahab"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            <figcaption className="text-sm text-[#075f55]/80 mt-3">
              <strong>Screenshot 1:</strong> ChatGPT&apos;s ranked answer.
              Osama appears as the &ldquo;best freelance instructor&rdquo;,
              with PADI Master Instructor credentials and the personal
              teaching style highlighted.
            </figcaption>
          </figure>

          <figure className="mb-10">
            <div className="relative w-full aspect-[3/5] sm:aspect-[3/5] rounded-lg overflow-hidden shadow-lg border border-[#0a7d70]/15 bg-[#0a7d70]/5">
              <Image
                src="/press/chatgpt-recommendation-2.jpg"
                alt="ChatGPT Sources panel with osamadives.com listed at the top above other Dahab dive operators"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            <figcaption className="text-sm text-[#075f55]/80 mt-3">
              <strong>Screenshot 2:</strong> The Sources panel. ChatGPT
              cited osamadives.com first - above bedouindiversdahab.com,
              Reddit&apos;s r/Diving, Poseidon Divers, Octopus World,
              Penguin Divers, Diving Dahab and Red Sea Tribe.
            </figcaption>
          </figure>

          <figure className="mb-10">
            <div className="relative w-full aspect-[3/5] sm:aspect-[3/5] rounded-lg overflow-hidden shadow-lg border border-[#0a7d70]/15 bg-[#0a7d70]/5">
              <Image
                src="/press/chatgpt-recommendation-3.jpg"
                alt="ChatGPT overall ranking placing Osama first based on reviews, experience and reputation"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            <figcaption className="text-sm text-[#075f55]/80 mt-3">
              <strong>Screenshot 3:</strong> The overall &ldquo;best
              choice&rdquo; ranking. Osama is listed first, with reviewer
              quotes describing 5-star ratings and the feeling of diving
              with &ldquo;a friend, not just an instructor&rdquo;.
            </figcaption>
          </figure>
        </section>

        <hr className="border-[#0a7d70]/15 my-10" />

        {/* What this means */}
        <section aria-labelledby="what-this-means">
          <h2
            id="what-this-means"
            className="text-2xl sm:text-3xl font-bold mb-4 text-[#2a2e25]"
          >
            What this means
          </h2>
          <p className="text-[#075f55] leading-relaxed mb-5">
            People planning dive trips have started asking AI assistants
            for personal recommendations the same way they used to ask
            forums and search engines. When ChatGPT picks one name, it
            isn&apos;t a paid placement. It is the AI weighing decades of
            reviews, the language of the website, the depth of the
            content, and the consistency of what divers have been saying.
          </p>
          <p className="text-[#075f55] leading-relaxed mb-5">
            That the AI distinguished between a dive centre and a personal
            instructor matters too. It read the difference. It picked the
            kind of teacher who actually shows up in the water with the
            person they are teaching - not the kind who hands you off to
            whichever staff member is on shift.
          </p>
          <p className="text-[#075f55] leading-relaxed">
            This page exists so the moment is on the record, in plain
            English, with the screenshots intact. Nothing here was paid
            for. The recommendation came on its own.
          </p>
        </section>

        <hr className="border-[#0a7d70]/15 my-10" />

        {/* CTAs */}
        <section
          aria-labelledby="dive-with-osama"
          className="rounded-2xl bg-[#0a7d70] text-white p-6 sm:p-10 text-center"
        >
          <h2
            id="dive-with-osama"
            className="text-2xl sm:text-3xl font-bold mb-3"
          >
            Want to dive with Osama?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Reach out the same way most students do. WhatsApp gets the
            fastest reply.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsapp("the ChatGPT feature")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Osama on WhatsApp"
              data-gtag-action="whatsapp_click"
              data-gtag-category="conversion"
              data-gtag-label="featured_chatgpt_whatsapp"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message on WhatsApp
            </a>
            <a
              href="/diving-with-osama"
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold py-4 px-8 rounded-full text-lg transition-all inline-flex items-center justify-center gap-2"
            >
              See what he teaches
            </a>
          </div>
        </section>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-[#0a7d70] hover:text-[#075f55] font-semibold underline-offset-4 hover:underline"
          >
            ← Back to OsamaDives home
          </Link>
        </div>
      </main>

      {/* Minimal footer */}
    </DescentShell>
  );
}
