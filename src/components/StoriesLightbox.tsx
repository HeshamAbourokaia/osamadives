"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { FacebookPost } from "@/lib/facebook-content";

interface StoriesLightboxProps {
  post: FacebookPost | null;
  posts: FacebookPost[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

/**
 * StoriesLightbox Component
 *
 * Full-screen lightbox that displays:
 * - Enlarged photo/video thumbnail
 * - Full caption/story from Facebook post
 * - Location with Google Maps link
 * - Navigation between posts
 * - Direct link to Facebook post
 */
export default function StoriesLightbox({
  post,
  posts,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: StoriesLightboxProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onNavigate("prev");
          break;
        case "ArrowRight":
          onNavigate("next");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex overflow-y-auto md:overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Story lightbox"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition z-50"
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

      {/* Navigation Buttons */}
      <button
        onClick={() => onNavigate("prev")}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition z-50"
        aria-label="Previous story"
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

      <button
        onClick={() => onNavigate("next")}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition z-50 md:right-[420px]"
        aria-label="Next story"
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

      {/* Main Content - Split View */}
      <div className="flex flex-col md:flex-row w-full min-h-full md:h-full">
        {/* Image/Video Section */}
        <div
          className="flex-1 shrink-0 flex items-center justify-center p-3 pt-16 md:p-8"
          onClick={(e) => {
            // Close on background click
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="relative max-w-5xl max-h-[70vh] md:max-h-[88vh] w-full">
            {post.type === "video" ? (
              <div className="relative aspect-video">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
                {/* Play button overlay for videos */}
                <a
                  href={post.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors rounded-lg"
                >
                  <div className="bg-red-600 rounded-full p-6 hover:scale-110 transition-transform">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="absolute bottom-4 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
                    Watch on Facebook
                  </span>
                </a>
              </div>
            ) : (
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={1200}
                height={800}
                className="max-h-[70vh] md:max-h-[88vh] w-auto h-auto object-contain rounded-lg mx-auto"
                priority
              />
            )}
          </div>
        </div>

        {/* Story/Caption Sidebar */}
        <div className="w-full shrink-0 md:w-[400px] bg-gray-900 md:overflow-y-auto md:h-full">
          <div className="p-6">
            {/* Header with type badge */}
            <div className="flex items-center gap-2 mb-4">
              {post.type === "video" && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  VIDEO {post.videoDuration && `- ${post.videoDuration}`}
                </span>
              )}
              {post.type === "album" && (
                <span className="bg-[#5a5f4e] text-white text-xs font-bold px-2 py-1 rounded-full">
                  ALBUM - {post.photoCount} photos
                </span>
              )}
              {post.featured && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  FEATURED
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-white text-2xl font-bold mb-2">{post.title}</h2>

            {/* Date */}
            <p className="text-gray-400 text-sm mb-4">{formatDate(post.date)}</p>

            {/* Location with Google Maps */}
            {post.location && (
              <a
                href={post.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#5a9f5a] hover:text-[#7abf7a] mb-6 transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
                <span>{post.location.name}</span>
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}

            {/* Divider */}
            <div className="border-t border-gray-700 my-6" />

            {/* Caption/Story */}
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {post.caption}
              </p>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-700 my-6" />

            {/* View on Facebook CTA */}
            <a
              href={post.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#1877F2] hover:bg-[#1565D8] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              View on Facebook
            </a>

            {/* Navigation info */}
            <p className="text-center text-gray-500 text-sm mt-6">
              {currentIndex + 1} of {posts.length} stories
            </p>
            <p className="text-center text-gray-600 text-xs mt-2">
              Use arrow keys to navigate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
