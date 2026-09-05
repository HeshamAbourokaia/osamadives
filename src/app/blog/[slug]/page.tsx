"use client";

import Image from "next/image";
import BackToPlace from "@/components/BackToPlace";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getPostBySlug,
  getAllPosts,
  formatDate,
  type BlogPost,
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
          style={{ fontFamily: "serif" }}
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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      const foundPost = getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        // Get related posts (other posts, excluding current)
        const allPosts = getAllPosts();
        setRelatedPosts(allPosts.filter((p) => p.slug !== slug).slice(0, 2));
      } else {
        setNotFound(true);
      }
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Story Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            This story may have drifted away with the current.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-[#5a5f4e] hover:bg-[#4a4f3e] text-white font-bold py-3 px-6 rounded-full transition"
          >
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Skip Link for Accessibility */}
      <a
        href="#article-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-[#5a5f4e] text-white px-4 py-2 rounded-full z-[100] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to article
      </a>

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-white/90">
            <Link
              href="/#why-dahab"
              className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
            >
              Why Dahab
            </Link>
            <Link
              href="/#about"
              className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
            >
              About
            </Link>
            <Link
              href="/#experiences"
              className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
            >
              Experiences
            </Link>
            <Link
              href="/gallery"
              className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
            >
              Gallery
            </Link>
            <Link
              href="/blog"
              className="text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
            >
              Journal
            </Link>
            <Link
              href="/#contact"
              className="bg-white text-[#5a5f4e] px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e]"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-[#5a5f4e] border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/#why-dahab"
                className="block text-white/90 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Why Dahab
              </Link>
              <Link
                href="/#about"
                className="block text-white/90 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/#experiences"
                className="block text-white/90 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Experiences
              </Link>
              <Link
                href="/gallery"
                className="block text-white/90 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                className="block text-white font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Journal
              </Link>
              <Link
                href="/#contact"
                className="block bg-white text-[#5a5f4e] px-4 py-3 rounded-full font-semibold text-center hover:bg-gray-100 transition mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

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
              style={{ fontFamily: "serif" }}
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
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light border-l-4 border-[#5a5f4e] pl-6">
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
          <div className="mt-8 p-6 bg-[#5a5f4e]/5 rounded-xl">
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
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#5a5f4e] transition-colors">
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
                className="inline-flex items-center gap-2 text-[#5a5f4e] font-semibold hover:underline"
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
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white font-bold text-2xl">OsamaDives</span>
            <span className="text-gray-500 text-sm">- Since 1983</span>
          </div>
          <p className="text-sm mb-4 max-w-xl mx-auto">
            Thank you for reading. Every story I write is an attempt to share
            what the sea has taught me. I hope something here resonated with
            you.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <a
              href="https://facebook.com/osamasharks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Visit Osama Dives on Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/osama_mohamed_hassan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Visit Osama Dives on Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm">
            <p>
              &copy; 2025 OsamaDives.com - Personal Blog &amp; Portfolio -
              Dahab, Egypt
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <Link
                href="/"
                className="text-[#5a5f4e] hover:underline"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-[#5a5f4e] hover:underline"
              >
                Journal
              </Link>
              <Link
                href="/gallery"
                className="text-[#5a5f4e] hover:underline"
              >
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Heritage Badge */}
      <FloatingBadge />
      <BackToPlace />
    </div>
  );
}
