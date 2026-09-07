import DescentShell from "@/app/DescentShell";
import StoryTail from "@/app/StoryTail";
import Image from "next/image";
import BackToPlace from "@/components/BackToPlace";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPostBySlug,
  getAllPosts,
  formatDate,
} from "@/lib/blog-posts";
import FloatingBadge from "@/components/FloatingBadge";

// Simple markdown-style content renderer
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={key++} className="mb-6 text-gray-700 leading-relaxed text-lg">
          {currentParagraph.join(" ")}
        </p>
      );
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // H2 headers
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-bold text-gray-900 mt-10 mb-4"
         
        >
          {trimmed.slice(3)}
        </h2>
      );
    }
    // H3 headers
    else if (trimmed.startsWith("### ")) {
      flushParagraph();
      elements.push(
        <h3
          key={key++}
          className="text-xl font-bold text-gray-900 mt-8 mb-3"
        >
          {trimmed.slice(4)}
        </h3>
      );
    }
    // Empty lines
    else if (trimmed === "") {
      flushParagraph();
    }
    // Regular text
    else {
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  return elements;
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Story not found | OsamaDives" };
  const title = `${post.title} | Osama's diving journal, Dahab`;
  return {
    title,
    description: post.excerpt,
    alternates: { canonical: `https://www.osamadives.com/blog/${post.slug}` },
    openGraph: { type: "article", title, description: post.excerpt, url: `https://www.osamadives.com/blog/${post.slug}`, publishedTime: post.date },
  };
}

// Rendered on the server: the whole story is in the page a search engine reads, not
// loaded afterwards in the browser, which left it nearly empty to a crawler.
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const relatedPosts = getAllPosts().filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <DescentShell>
      {/* Skip Link for Accessibility */}
      <a
        href="#article-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-[#0a7d70] text-white px-4 py-2 rounded-full z-[100] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to article
      </a>


      {/* Hero Image */}
      <header className="relative h-[50vh] min-h-[400px] mt-14">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back to Journal Link */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-medium py-2 px-4 rounded-full transition border border-white/30"
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
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Journal
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3"
             
            >
              {post.title}
            </h1>
            <time className="text-white/80 text-lg">
              {formatDate(post.date)}
            </time>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main id="article-content" className="py-12 px-4">
        <article className="max-w-3xl mx-auto">
          {/* Lead paragraph / excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-[#0a7d70] pl-6">
            {post.excerpt}
          </p>

          {/* Main content */}
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>

          {/* Author signature */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/images/OsamaDives_Him_Self.jpeg"
                  alt="Osama - PADI Master Scuba Diver Trainer"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900">Osama</p>
                <p className="text-sm text-gray-600">
                  PADI Master Scuba Diver Trainer | Pioneer Family Since 1983
                </p>
              </div>
            </div>
          </div>

          {/* Share / Contact CTA */}
          <div className="mt-8 p-6 bg-[#0a7d70]/5 rounded-xl">
            <p className="text-gray-700 mb-4">
              Have questions about this story or want to experience Dahab&apos;s
              underwater world yourself? I would love to hear from you.
            </p>
            <a
              href="https://wa.me/201090208050?text=Hi%20Osama!%20I%20just%20read%20your%20story%20and%20would%20love%20to%20chat%20about%20diving%20in%20Dahab!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </article>

        <StoryTail title={post.title} url={`https://www.osamadives.com/blog/${post.slug}`} />
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              More Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.slug}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <time className="text-white/80 text-sm">
                          {formatDate(relatedPost.date)}
                        </time>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0a7d70] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#0a7d70] font-semibold hover:underline"
              >
                View all stories
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}

      {/* Floating Heritage Badge */}
      <FloatingBadge />
      <BackToPlace />
    </DescentShell>
  );
}
