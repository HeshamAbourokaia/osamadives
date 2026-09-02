"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPostBySlug,
  getAllPosts,
  formatDate,
  type BlogPost,
} from "@/lib/blog-posts";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p
          key={key++}
          className="mb-7 text-abyss/85 leading-relaxed text-lg sm:text-xl"
        >
          {currentParagraph.join(" ")}
        </p>
      );
      currentParagraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      elements.push(
        <h2
          key={key++}
          className="font-display text-3xl sm:text-4xl text-abyss mt-14 mb-5 leading-snug"
        >
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushParagraph();
      elements.push(
        <h3
          key={key++}
          className="font-display text-2xl text-abyss mt-10 mb-4 leading-snug"
        >
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed === "") {
      flushParagraph();
    } else {
      currentParagraph.push(trimmed);
    }
  }
  flushParagraph();
  return elements;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (slug) {
      const foundPost = getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        const allPosts = getAllPosts();
        setRelatedPosts(allPosts.filter((p) => p.slug !== slug).slice(0, 2));
      } else {
        setNotFoundState(true);
      }
    }
  }, [slug]);

  if (notFoundState) {
    return (
      <main className="min-h-screen bg-abyss text-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="label-eyebrow text-sun-glint mb-4">Lost in the current</p>
          <h1 className="font-display text-5xl mb-6">Story not found.</h1>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-reef hover:bg-reef/90 text-white px-6 py-3 rounded-full font-mono uppercase text-xs tracking-widest"
          >
            Back to journal
          </Link>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-abyss text-white flex items-center justify-center">
        <p className="font-mono text-sm text-white/40 animate-pulse">Loading.</p>
      </main>
    );
  }

  const whatsappHref = `https://wa.me/201090208050?text=${encodeURIComponent(
    `Hi Osama! I just read your story "${post.title}" and would love to chat about diving in Dahab.`
  )}`;

  return (
    <main className="bg-bone text-abyss">
      <TopNav />

      {/* Cinematic header */}
      <header className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-abyss">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/55 via-abyss/30 to-abyss" />
        <div className="absolute inset-x-0 bottom-0 px-5 sm:px-10 pb-16">
          <div className="max-w-3xl mx-auto text-white">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              The journal
            </Link>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono uppercase tracking-widest text-white/70 border border-white/20 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] mb-6 text-balance">
              {post.title}
            </h1>
            <time className="text-white/70 font-mono text-sm uppercase tracking-widest">
              {formatDate(post.date)}
            </time>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="bg-bone py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="font-display text-2xl sm:text-3xl text-abyss leading-snug mb-12 pl-6 border-l-2 border-reef">
            {post.excerpt}
          </p>
          <div>{renderContent(post.content)}</div>

          {/* Author */}
          <div className="mt-16 pt-10 border-t border-abyss/15 flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-abyss/10">
              <Image
                src="/images/OsamaDives_Him_Self.jpeg"
                alt="Osama, PADI MSDT"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-display text-xl text-abyss">Osama.</p>
              <p className="text-sm font-mono text-abyss/55 uppercase tracking-widest">
                PADI MSDT. Dahab, since 1983.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 p-8 sm:p-10 bg-abyss/[0.04] border-l-2 border-reef">
            <p className="text-abyss/85 text-lg leading-relaxed mb-6">
              Got something to ask, or want to dive together? Send me a message.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-reef hover:bg-reef/90 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message me on WhatsApp
            </a>
          </div>
        </div>
      </article>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="bg-abyss text-white py-24 px-5 sm:px-10">
          <div className="max-w-editorial mx-auto">
            <p className="label-eyebrow text-sun-glint mb-4">Keep reading</p>
            <h2 className="font-display text-3xl sm:text-5xl leading-[1.05] mb-12">
              More from the journal.
            </h2>
            <div className="grid md:grid-cols-2 gap-7">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-abyss mb-4">
                    <Image
                      src={rp.featuredImage}
                      alt={rp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 to-transparent" />
                  </div>
                  <p className="label-eyebrow text-sun-glint/70 mb-2">
                    {formatDate(rp.date)}
                  </p>
                  <p className="font-display text-2xl group-hover:text-sun-glint transition-colors">
                    {rp.title}
                  </p>
                  <p className="text-sm text-white/55 mt-2 line-clamp-2">
                    {rp.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-sun-glint hover:text-white transition-colors"
              >
                View all stories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingWhatsApp context={`I just read your story about ${post.title}.`} />
    </main>
  );
}
