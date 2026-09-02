"use client";

import Image from "next/image";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog-posts";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="bg-bone text-abyss">
      <TopNav forceSolid />

      <header className="bg-abyss text-white pt-32 pb-20 px-5 sm:px-10">
        <div className="max-w-editorial mx-auto">
          <p className="label-eyebrow text-sun-glint mb-6">The journal</p>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.02] max-w-3xl mb-6">
            Stories from
            <br />
            beneath the surface.
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            Reflections from a diver who has called Dahab home since 1983. The
            Blue Hole, night dives, reef life, and the people I have shared
            them with.
          </p>
        </div>
      </header>

      <section id="blog-content" className="py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-editorial mx-auto">
          <div className="grid gap-12 md:grid-cols-2">
            {posts.map((post, i) => (
              <article key={post.slug} className={`group ${i === 0 ? "md:col-span-2" : ""}`}>
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className={`relative overflow-hidden rounded-sm bg-abyss/10 mb-5 ${i === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes={i === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <p className="label-eyebrow text-reef mb-3">
                    {formatDate(post.date)}
                  </p>
                  <h2 className={`font-display text-abyss group-hover:text-reef transition-colors mb-3 leading-snug ${i === 0 ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>
                    {post.title}
                  </h2>
                  <p className="text-abyss/70 leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono uppercase tracking-widest text-abyss/55 border border-abyss/15 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-24 pt-12 border-t border-abyss/15 max-w-2xl mx-auto text-center">
            <p className="font-display text-3xl text-abyss leading-snug mb-6">
              The sea keeps teaching me. I keep writing.
            </p>
            <a
              href="https://facebook.com/osamasharks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-abyss text-white px-6 py-3 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-reef transition-colors"
            >
              Follow on Facebook
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
