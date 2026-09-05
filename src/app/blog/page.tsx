"use client";

import Image from "next/image";
import BackToPlace from "@/components/BackToPlace";
import Link from "next/link";
import { useState } from "react";
import { getAllPosts, formatDate } from "@/lib/blog-posts";
import FloatingBadge from "@/components/FloatingBadge";

export default function BlogPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Skip Link for Accessibility */}
      <a
        href="#blog-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-[#5a5f4e] text-white px-4 py-2 rounded-full z-[100] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to journal
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

      {/* Hero Section */}
      <header className="pt-24 pb-12 px-4 bg-gradient-to-b from-[#5a5f4e] to-[#6a6f5e]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: "serif" }}
          >
            Diving Journal
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Stories from beneath the surface. Reflections on a life lived
            underwater. Notes from a diver who has called Dahab home since 1983.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main id="blog-content" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Blog Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <time className="text-white/80 text-sm">
                        {formatDate(post.date)}
                      </time>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#5a5f4e] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#5a5f4e]/10 text-[#5a5f4e] text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="mt-16 bg-gradient-to-r from-[#5a5f4e]/10 via-[#5a5f4e]/5 to-[#5a5f4e]/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              More Stories Coming
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              The sea keeps teaching me, and I keep writing. Follow along for
              new stories from the reef, diving tips, and glimpses of life in
              Dahab.
            </p>
            <a
              href="https://facebook.com/osamasharks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1565D8] text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Follow on Facebook
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
            Writing about diving is almost as hard as diving itself. The sea
            speaks a language that does not translate well to words. But I keep
            trying, because some stories deserve to be told.
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
            <Link
              href="/"
              className="text-[#5a5f4e] hover:underline mt-2 inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Heritage Badge */}
      <FloatingBadge />
      <BackToPlace />
    </div>
  );
}
