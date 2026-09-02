"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  galleryPhotos,
  getCategories,
  categoryLabels,
  FACEBOOK_PAGE_URL,
  INSTAGRAM_URL,
} from "@/lib/gallery-config";
import {
  getFeaturedStories,
  getAllStoriesSorted,
  getVideoStories,
  FACEBOOK_VIDEOS_URL,
  type FacebookPost,
} from "@/lib/facebook-content";
import FacebookGalleryItem from "@/components/FacebookGalleryItem";
import StoriesLightbox from "@/components/StoriesLightbox";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Lightbox, { type LightboxPhoto } from "@/components/Lightbox";

type GalleryTab = "photos" | "stories" | "videos";

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("photos");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [storiesLightboxOpen, setStoriesLightboxOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storiesList, setStoriesList] = useState<FacebookPost[]>([]);

  const filteredPhotos =
    selectedCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === selectedCategory);

  const allStories = getAllStoriesSorted();
  const featuredStories = getFeaturedStories();
  const videoStories = getVideoStories();

  const lightboxData: LightboxPhoto[] = filteredPhotos.map((p) => ({
    src: p.src,
    alt: p.alt,
    title: p.title,
    caption: p.location,
  }));

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const openStoriesLightbox = useCallback(
    (post: FacebookPost, sourceList?: FacebookPost[]) => {
      const list = sourceList || allStories;
      const index = list.findIndex((p) => p.id === post.id);
      setStoriesList(list);
      setCurrentStoryIndex(index >= 0 ? index : 0);
      setStoriesLightboxOpen(true);
    },
    [allStories]
  );

  const closeStoriesLightbox = useCallback(() => {
    setStoriesLightboxOpen(false);
  }, []);

  const navigateStories = useCallback(
    (direction: "prev" | "next") => {
      setCurrentStoryIndex((prev) => {
        if (direction === "prev") {
          return prev === 0 ? storiesList.length - 1 : prev - 1;
        }
        return prev === storiesList.length - 1 ? 0 : prev + 1;
      });
    },
    [storiesList.length]
  );

  // Reset to first photo when category changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [selectedCategory]);

  const categories = getCategories();

  return (
    <main className="bg-bone text-abyss">
      <TopNav forceSolid />

      {/* Cinematic header */}
      <header className="relative h-[55vh] min-h-[420px] w-full overflow-hidden bg-abyss pt-16">
        <Image
          src="/images/Osama7Tanks.jpeg"
          alt="Osama with tanks before a dive"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss/55 via-abyss/40 to-abyss" />
        <div className="absolute inset-x-0 bottom-0 px-5 sm:px-10 pb-14">
          <div className="max-w-editorial mx-auto text-white">
            <p className="label-eyebrow text-sun-glint mb-6">The gallery</p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.02] max-w-3xl mb-6">
              Through my lens.
            </h1>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
              Photos and stories from waters I have known since childhood, dive
              sites I have memorised like old friends, and moments I have been
              privileged to share.
            </p>
          </div>
        </div>
      </header>

      <main id="gallery-content" className="py-16 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Tab nav */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-abyss/5 border border-abyss/10 rounded-full p-1 font-mono uppercase tracking-widest text-xs">
              {(["photos", "stories", "videos"] as GalleryTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full transition-all ${
                    activeTab === tab
                      ? "bg-abyss text-white"
                      : "text-abyss/65 hover:text-abyss"
                  }`}
                >
                  {tab === "photos"
                    ? "Photos"
                    : tab === "stories"
                    ? "Stories"
                    : "Videos"}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          {activeTab === "photos" && (
            <>
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition ${
                    selectedCategory === "all"
                      ? "bg-reef text-white"
                      : "bg-abyss/5 text-abyss/70 hover:text-abyss"
                  }`}
                >
                  All ({galleryPhotos.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition ${
                      selectedCategory === cat
                        ? "bg-reef text-white"
                        : "bg-abyss/5 text-abyss/70 hover:text-abyss"
                    }`}
                  >
                    {categoryLabels[cat as keyof typeof categoryLabels]} (
                    {galleryPhotos.filter((p) => p.category === cat).length})
                  </button>
                ))}
              </div>

              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {filteredPhotos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => openLightbox(i)}
                    className="break-inside-avoid mb-4 block w-full group text-left"
                  >
                    <div className="relative overflow-hidden rounded-sm bg-abyss/10">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-abyss/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 inset-x-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-display text-lg">{photo.title}</p>
                        {photo.location && (
                          <p className="text-xs font-mono text-white/70 mt-1">
                            {photo.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Stories */}
          {activeTab === "stories" && (
            <>
              <div className="text-center mb-10">
                <p className="text-abyss/70 max-w-2xl mx-auto">
                  Read the stories behind the photos. Each dive tells a tale,
                  from first breaths underwater to encounters with marine life.
                </p>
              </div>

              {featuredStories.length > 0 && (
                <div className="mb-16">
                  <p className="label-eyebrow text-reef mb-6">Featured stories</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredStories.map((post) => (
                      <FacebookGalleryItem
                        key={post.id}
                        post={post}
                        onOpenLightbox={(p) =>
                          openStoriesLightbox(p, featuredStories)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="label-eyebrow text-reef mb-6">All stories</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allStories.map((post) => (
                    <FacebookGalleryItem
                      key={post.id}
                      post={post}
                      onOpenLightbox={(p) => openStoriesLightbox(p, allStories)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Videos */}
          {activeTab === "videos" && (
            <>
              <div className="text-center mb-10">
                <p className="text-abyss/70 max-w-2xl mx-auto">
                  Video highlights from diving in Dahab. Tap to read about the
                  dive, or watch the full video on Facebook.
                </p>
                <a
                  href={FACEBOOK_VIDEOS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-mono uppercase tracking-widest text-reef hover:text-abyss transition-colors"
                >
                  View all videos on Facebook
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              {videoStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoStories.map((post) => (
                    <FacebookGalleryItem
                      key={post.id}
                      post={post}
                      onOpenLightbox={(p) =>
                        openStoriesLightbox(p, videoStories)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-abyss/5 rounded-sm">
                  <p className="text-abyss/55">
                    Watch the latest videos on Facebook.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Footer-of-section CTA */}
          <div className="mt-20 pt-12 border-t border-abyss/15">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-display text-3xl sm:text-4xl text-abyss leading-snug mb-6">
                The story continues on the reef.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-abyss text-white px-6 py-3 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-reef transition-colors"
                >
                  Follow on Facebook
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-abyss text-abyss px-6 py-3 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-abyss hover:text-white transition-colors"
                >
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {lightboxOpen && lightboxData[currentPhotoIndex] && (
        <Lightbox
          photos={lightboxData}
          index={currentPhotoIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setCurrentPhotoIndex}
        />
      )}

      <StoriesLightbox
        post={storiesList[currentStoryIndex] || null}
        posts={storiesList}
        currentIndex={currentStoryIndex}
        isOpen={storiesLightboxOpen}
        onClose={closeStoriesLightbox}
        onNavigate={navigateStories}
      />

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
