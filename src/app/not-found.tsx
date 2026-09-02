import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-abyss text-white">
      <Image
        src="/images/OsamaDives_The_Blue_Hole.jpeg"
        alt="The Blue Hole, Dahab"
        fill
        sizes="100vw"
        priority
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/60 via-abyss/80 to-abyss" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="label-eyebrow text-sun-glint mb-6">404</p>
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[1.02] max-w-3xl">
          This page drifted off
          <br />
          with the current.
        </h1>
        <p className="mt-8 text-white/70 text-lg max-w-md leading-relaxed">
          The link you followed does not exist on the reef. Try the homepage, or
          message me directly.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-5 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-reef hover:bg-reef/90 text-white px-7 py-4 rounded-full text-sm font-mono uppercase tracking-widest transition-colors"
          >
            Back to surface
          </Link>
          <a
            href="https://wa.me/201090208050"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white px-2 py-3 text-sm font-mono uppercase tracking-widest border-b border-white/30 hover:border-white/80 transition-colors"
          >
            Message me on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
