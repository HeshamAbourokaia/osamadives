"use client";

import Image from "next/image";
import Link from "next/link";

export default function FloatingBadge() {
  return (
    <Link
      href="/"
      className="fixed bottom-6 left-6 z-40 group"
      aria-label="OsamaDives - Dahab Since 1983"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-[#d4a857] rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

      {/* Badge container - circular with background to hide any transparency issues */}
      <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300 rounded-full overflow-hidden bg-[#c9a45c]">
        <Image
          src="/brand/stamp-512.png"
          alt="OsamaDives stamp: Shark family, Dahab, since 1983"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900/90 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          <span className="font-semibold">OsamaDives</span>
          <span className="text-gray-400 ml-1">• Dahab Since 1983</span>
        </div>
      </div>
    </Link>
  );
}
