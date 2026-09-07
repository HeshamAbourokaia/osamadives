import DescentShell from "@/app/DescentShell";
import StoryDeck from "@/app/StoryDeck";
import Image from "next/image";
import BackToPlace from "@/components/BackToPlace";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog-posts";
import FloatingBadge from "@/components/FloatingBadge";

export const metadata = {
  title: "Diving journal from Dahab | Osama, PADI instructor",
  description: "Stories from beneath the surface by Osama, a PADI Master Scuba Diver Trainer in Dahab: a thousand dives at the Blue Hole, why he teaches, what the night does to a reef.",
  alternates: { canonical: "https://www.osamadives.com/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <DescentShell>
      {/* Skip Link for Accessibility */}
      <a
        href="#blog-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-[#0a7d70] text-white px-4 py-2 rounded-full z-[100] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to journal
      </a>


      {/* Hero Section */}
      <header className="only-desktop pt-24 pb-12 px-4 bg-gradient-to-b from-[#061420] to-[#0a2a3a]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1
            className="text-4xl md:text-5xl font-light mb-4"
           
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
                    <StoryDeck
            share="Stories from the water"
            items={posts.map((post) => ({ href: `/blog/${post.slug}`, title: post.title, kicker: `${new Date(post.date).getFullYear()} · Journal`, text: post.excerpt, image: post.featuredImage, alt: post.title }))}
          />
<div className="only-desktop grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0a7d70] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#0a7d70]/10 text-[#0a7d70] text-xs px-2 py-1 rounded"
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
          <div className="mt-16 bg-gradient-to-r from-[#0a7d70]/10 via-[#0a7d70]/5 to-[#0a7d70]/10 rounded-2xl p-8 text-center">
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

      {/* Floating Heritage Badge */}
      <FloatingBadge />
      <BackToPlace />
      {/* The journal's closing line, as the old page had it */}
      <p className="mx-auto max-w-xl px-4 pb-14 text-center text-sm text-[#075f55]">
        Writing about diving is almost as hard as diving itself. The sea speaks a language that does not translate well to words. But I keep trying, because some stories deserve to be told.
      </p>
    </DescentShell>
  );
}
