"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import type { FacebookPost } from "@/lib/facebook-content";

interface FacebookGalleryItemProps {
  post: FacebookPost;
  onOpenLightbox: (post: FacebookPost) => void;
  layout?: "grid" | "masonry" | "featured";
}

/**
 * FacebookGalleryItem Component
 *
 * Interaction patterns:
 * - Single click: Opens lightbox to view enlarged photo on website
 * - Double click: Opens Facebook in new tab
 * - Ctrl+click (Cmd+click on Mac): Opens Facebook in new tab
 *
 * Visual feedback:
 * - Hover tooltip explaining interaction options
 * - Video badge for video content
 * - Album badge with photo count for albums
 * - Location pin with Google Maps link
 */
export default function FacebookGalleryItem({
  post,
  onOpenLightbox,
  layout = "grid",
}: FacebookGalleryItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  // Detect Mac OS on client side
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
             navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Handle click with single/double detection
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Check for Ctrl+click (Windows) or Cmd+click (Mac)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        window.open(post.facebookUrl, "_blank", "noopener,noreferrer");
        return;
      }

      clickCountRef.current += 1;

      if (clickCountRef.current === 1) {
        // Wait to see if this becomes a double click
        clickTimeoutRef.current = setTimeout(() => {
          // Single click - open lightbox
          if (clickCountRef.current === 1) {
            onOpenLightbox(post);
          }
          clickCountRef.current = 0;
        }, 250); // 250ms to detect double click
      } else if (clickCountRef.current === 2) {
        // Double click - open Facebook
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }
        clickCountRef.current = 0;
        window.open(post.facebookUrl, "_blank", "noopener,noreferrer");
      }
    },
    [post, onOpenLightbox]
  );

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (e.ctrlKey || e.metaKey) {
          window.open(post.facebookUrl, "_blank", "noopener,noreferrer");
        } else {
          onOpenLightbox(post);
        }
      }
    },
    [post, onOpenLightbox]
  );

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get layout-specific classes
  const getContainerClasses = () => {
    switch (layout) {
      case "featured":
        return "col-span-2 row-span-2";
      case "masonry":
        return "break-inside-avoid mb-4";
      default:
        return "";
    }
  };

  return (
    <article
      className={`group relative cursor-pointer ${getContainerClasses()}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
      role="button"
      aria-label={`${post.title}. Click to enlarge, double-click or ${isMac ? 'Command' : 'Ctrl'}+click to view on Facebook`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type Badge */}
        {post.type === "video" && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            {post.videoDuration || "VIDEO"}
          </div>
        )}

        {post.type === "album" && post.photoCount && (
          <div className="absolute top-3 left-3 bg-[#0a7d70] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            {post.photoCount} photos
          </div>
        )}

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
            FEATURED
          </div>
        )}

        {/* Facebook Link Indicator */}
        <div className="absolute top-3 right-3 bg-[#1877F2] text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>

        {/* Hover Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg line-clamp-1">
            {post.title}
          </h3>

          {/* Location with Google Maps link */}
          {post.location && (
            <a
              href={post.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 text-sm flex items-center gap-1 hover:text-white hover:underline mt-1"
              onClick={(e) => e.stopPropagation()} // Prevent parent click handler
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {post.location.name}
            </a>
          )}

          {/* Date */}
          <p className="text-white/60 text-xs mt-1">{formatDate(post.date)}</p>
        </div>

        {/* Play Button Overlay for Videos */}
        {post.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-4 group-hover:bg-red-600/80 transition-colors duration-300">
              <svg
                className="w-12 h-12 text-white"
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
          </div>
        )}
      </div>

      {/* Interaction Tooltip */}
      {showTooltip && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-lg">
          <div className="flex flex-col items-center gap-0.5">
            <span>Click to enlarge</span>
            <span className="text-gray-400">
              {isMac ? '⌘+click' : 'Ctrl+click'} or double-click → Facebook
            </span>
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </article>
  );
}

/**
 * FacebookVideoEmbed Component
 * Uses Facebook embed iframe for videos (when user chooses to view on site)
 */
export function FacebookVideoEmbed({ postUrl }: { postUrl: string }) {
  // Extract video ID from Facebook URL if needed
  const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    postUrl
  )}&show_text=false&width=560`;

  return (
    <div className="aspect-video w-full max-w-3xl mx-auto">
      <iframe
        src={embedUrl}
        className="w-full h-full rounded-lg"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Facebook Video"
      />
    </div>
  );
}
