"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

export interface LightboxPhoto {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
}

interface Props {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const photo = photos[index];

  const goPrev = useCallback(() => {
    onNavigate(index === 0 ? photos.length - 1 : index - 1);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate(index === photos.length - 1 ? 0 : index + 1);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, goPrev, goNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-abyss/97 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full"
        aria-label="Close"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3"
        aria-label="Previous"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3"
        aria-label="Next"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div
        className="relative max-w-6xl max-h-[85vh] w-full mx-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[80vh]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
        {(photo.title || photo.caption) && (
          <div className="mt-4 text-center text-white/80">
            {photo.title && (
              <p className="font-display text-xl mb-1">{photo.title}</p>
            )}
            {photo.caption && (
              <p className="text-sm font-mono text-white/60">{photo.caption}</p>
            )}
          </div>
        )}
        <p className="absolute -top-10 left-0 text-xs font-mono text-white/40 uppercase tracking-widest">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
