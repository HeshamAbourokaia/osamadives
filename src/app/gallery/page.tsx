"use client";

import Image from "next/image";
import BackToPlace from "@/components/BackToPlace";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  galleryPhotos,
  getCategories,
  categoryLabels,
  FACEBOOK_PAGE_URL,
  INSTAGRAM_URL,
  getGoogleMapsUrl,
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
import FloatingBadge from "@/components/FloatingBadge";

// Tab options for the gallery
type GalleryTab = "photos" | "stories" | "videos";

// Hook for intersection observer based scroll-reveal
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return { ref, isVisible };
}

// Individual gallery item with scroll-reveal
function GalleryItem({
  photo,
  index,
  onOpenLightbox,
}: {
  photo: (typeof galleryPhotos)[number];
  index: number;
  onOpenLightbox: (index: number) => void;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`break-inside-avoid mb-4 group cursor-pointer transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
      onClick={() => onOpenLightbox(index)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={600}
          height={400}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-bold text-lg">{photo.title}</h3>
          {photo.location && (
            <p className="text-sm text-white/80 flex items-center gap-1">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {photo.location}
            </p>
          )}
        </div>
        {photo.featured && (
          <div className="absolute top-3 right-3 bg-[#5a5f4e] text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}
        {photo.story && (
          <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            STORY
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("photos");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stories lightbox state
  const [storiesLightboxOpen, setStoriesLightboxOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storiesList, setStoriesList] = useState<FacebookPost[]>([]);

  // Filter photos based on selected category
  const filteredPhotos =
    selectedCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === selectedCategory);

  // Get stories and videos
  const allStories = getAllStoriesSorted();
  const featuredStories = getFeaturedStories();
  const videoStories = getVideoStories();

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = useCallback(() => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? filteredPhotos.length - 1 : prev - 1
    );
  }, [filteredPhotos.length]);

  const goToNext = useCallback(() => {
    setCurrentPhotoIndex((prev) =>
      prev === filteredPhotos.length - 1 ? 0 : prev + 1
    );
  }, [filteredPhotos.length]);

  // Stories lightbox handlers
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  const currentPhoto = filteredPhotos[currentPhotoIndex];
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Skip Link for Accessibility */}
      <a
        href="#gallery-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-[#5a5f4e] text-white px-4 py-2 rounded-full z-[100] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to gallery
      </a>

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#5a5f4e]/95 backdrop-blur-sm"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-white font-bold text-xl group-hover:text-white/90 transition">OsamaDives</span>
            <span className="text-white/60 text-sm hidden sm:inline">• Dahab Since 1983</span>
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
              href="/#stories"
              className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
            >
              Stories
            </Link>
            <Link
              href="/gallery"
              className="text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
            >
              Gallery
            </Link>
            <Link
              href="/blog"
              className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5a5f4e] rounded"
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
                href="/#stories"
                className="block text-white/90 hover:text-white transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Link
                href="/gallery"
                className="block text-white font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
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
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: "serif" }}
          >
            Through My Lens, Into My Home
          </h1>
          <p className="text-base sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto px-2">
            These are not just photographs - they are invitations. Each image holds a story
            from waters I have known since childhood, dive sites I have memorized like old friends,
            and moments of wonder I have been privileged to witness and share.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold py-2 px-4 rounded-full transition border border-white/30"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              View More on Facebook
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold py-2 px-4 rounded-full transition border border-white/30"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </header>

      {/* Main Gallery Content */}
      <main id="gallery-content" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab("photos")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "photos"
                    ? "bg-[#5a5f4e] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveTab("stories")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "stories"
                    ? "bg-[#5a5f4e] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Diving Stories
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "videos"
                    ? "bg-[#5a5f4e] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Videos
              </button>
            </div>
          </div>

          {/* Photos Tab */}
          {activeTab === "photos" && (
          <>
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === "all"
                  ? "bg-[#5a5f4e] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Photos ({galleryPhotos.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#5a5f4e] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoryLabels[category as keyof typeof categoryLabels]} (
                {galleryPhotos.filter((p) => p.category === category).length})
              </button>
            ))}
          </div>

          {/* Photo Counter */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredPhotos.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {galleryPhotos.length}
              </span>{" "}
              photos
              {selectedCategory !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-[#5a5f4e]">
                    {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <GalleryItem
                key={photo.id}
                photo={photo}
                index={index}
                onOpenLightbox={openLightbox}
              />
            ))}
          </div>
          </>
          )}

          {/* Diving Stories Tab */}
          {activeTab === "stories" && (
            <>
              {/* Stories Header */}
              <div className="text-center mb-8">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Read the stories behind the photos. Each dive tells a tale -
                  from first breaths underwater to encounters with amazing
                  marine life.
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    Click to enlarge
                  </span>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Ctrl+click for Facebook
                  </span>
                </p>
              </div>

              {/* Featured Stories Section */}
              {featuredStories.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured Stories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredStories.map((post) => (
                      <FacebookGalleryItem
                        key={post.id}
                        post={post}
                        onOpenLightbox={(p) => openStoriesLightbox(p, featuredStories)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Stories */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Diving Stories</h2>
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

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <>
              {/* Videos Header */}
              <div className="text-center mb-8">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Video highlights from diving adventures in Dahab. Click to
                  read about the dive, or watch the full video on Facebook.
                </p>
                <a
                  href={FACEBOOK_VIDEOS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#1877F2] hover:underline mt-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  View all videos on Facebook
                </a>
              </div>

              {/* Videos Grid */}
              {videoStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoStories.map((post) => (
                    <FacebookGalleryItem
                      key={post.id}
                      post={post}
                      onOpenLightbox={(p) => openStoriesLightbox(p, videoStories)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">Check out our Facebook page for diving videos!</p>
                  <a
                    href={FACEBOOK_VIDEOS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 bg-[#1877F2] hover:bg-[#1565D8] text-white font-semibold py-2 px-6 rounded-full transition"
                  >
                    Watch on Facebook
                  </a>
                </div>
              )}
            </>
          )}

          {/* View More on Facebook CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#5a5f4e]/10 via-[#5a5f4e]/5 to-[#5a5f4e]/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                The Story Continues
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Every dive writes a new chapter. I share fresh discoveries, underwater
                encounters, and the daily magic of Dahab on social media. Join me there
                for stories that do not fit in a gallery - the ones still unfolding.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1565D8] text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Follow on Facebook
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition z-10"
            aria-label="Close lightbox"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
            aria-label="Previous photo"
          >
            <svg
              className="w-8 h-8"
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
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
            aria-label="Next photo"
          >
            <svg
              className="w-8 h-8"
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
          </button>

          {/* Image Container - Wider for stories */}
          <div
            className={`mx-4 relative ${currentPhoto.story ? 'max-w-6xl flex flex-col lg:flex-row gap-4 items-start max-h-[90vh] overflow-y-auto' : 'max-w-5xl max-h-[85vh]'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={currentPhoto.story ? 'lg:flex-shrink-0 flex-shrink-0' : ''}>
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                width={1200}
                height={800}
                className={`${currentPhoto.story ? 'max-h-[40vh] lg:max-h-[70vh] lg:max-w-[600px]' : 'max-h-[75vh]'} w-auto h-auto object-contain rounded-lg`}
                priority
              />
            </div>

            {/* Extended Story Panel (for photos with stories) */}
            {currentPhoto.story && (
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 lg:max-w-md lg:max-h-[70vh] lg:overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">Diving Story</span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">
                  {currentPhoto.title}
                </h3>
                <p className="text-white/90 leading-relaxed text-base">
                  {currentPhoto.story}
                </p>
                {currentPhoto.location && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <span className="flex items-center gap-1 text-white/70 text-sm">
                      {currentPhoto.coordinates ? (
                        <a
                          href={getGoogleMapsUrl(currentPhoto.coordinates)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-white/80 hover:text-white transition group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z" />
                          </svg>
                          <span className="underline decoration-dotted">{currentPhoto.location}</span>
                        </a>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {currentPhoto.location}
                        </>
                      )}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-white/50 text-sm">
                  {currentPhotoIndex + 1} / {filteredPhotos.length}
                </div>
              </div>
            )}

            {/* Photo Info (for photos without stories) */}
            {!currentPhoto.story && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-bold">
                {currentPhoto.title}
              </h3>
              {currentPhoto.description && (
                <p className="text-white/80 mt-1">{currentPhoto.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                {currentPhoto.location && (
                  <span className="flex items-center gap-1">
                    {currentPhoto.coordinates ? (
                      <a
                        href={getGoogleMapsUrl(currentPhoto.coordinates)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-white/80 hover:text-white transition group"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${currentPhoto.location} on Google Maps`}
                      >
                        <svg
                          className="w-4 h-4 text-red-400 group-hover:text-red-300 transition"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 110-6 3 3 0 010 6z" />
                        </svg>
                        <span className="underline decoration-dotted underline-offset-2">
                          {currentPhoto.location}
                        </span>
                        <svg
                          className="w-3 h-3 opacity-60 group-hover:opacity-100 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <>
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {currentPhoto.location}
                      </>
                    )}
                  </span>
                )}
                <span>
                  {currentPhotoIndex + 1} / {filteredPhotos.length}
                </span>
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Stories Lightbox */}
      <StoriesLightbox
        post={storiesList[currentStoryIndex] || null}
        posts={storiesList}
        currentIndex={currentStoryIndex}
        isOpen={storiesLightboxOpen}
        onClose={closeStoriesLightbox}
        onNavigate={navigateStories}
      />

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white font-bold text-2xl">OsamaDives</span>
            <span className="text-gray-500 text-sm">• Since 1983</span>
          </div>
          <p className="text-sm mb-4 max-w-xl mx-auto">
            Every photograph here holds a story. Reefs I have watched grow over decades.
            Students discovering wonder for the first time. The play of light in waters
            my family has called home since 1983. Thank you for letting me share my world with you.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <a
              href={FACEBOOK_PAGE_URL}
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
              href={INSTAGRAM_URL}
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
              © 2025 OsamaDives.com - Personal Blog &amp; Portfolio - Dahab,
              Egypt
            </p>
            <Link href="/" className="text-[#5a5f4e] hover:underline mt-2 inline-block">
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
