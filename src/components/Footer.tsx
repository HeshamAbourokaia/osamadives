import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-abyss text-white/70 pt-20 pb-10 px-5 sm:px-8">
      <div className="max-w-editorial mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-14">
          <div>
            <p className="font-display text-2xl text-white mb-3">OsamaDives</p>
            <p className="text-sm leading-relaxed text-white/60">
              Osama. PADI Master Scuba Diver Trainer. Pioneer family in Dahab
              since 1983. Diving the Red Sea since 2011.
            </p>
          </div>
          <div>
            <p className="label-eyebrow text-white/40 mb-4">Wander</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#story" className="hover:text-white transition-colors">Story</Link></li>
              <li><Link href="/#reefs" className="hover:text-white transition-colors">The Reefs</Link></li>
              <li><Link href="/#diving" className="hover:text-white transition-colors">Diving</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-eyebrow text-white/40 mb-4">Reach me</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/201090208050"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/osama_mohamed_hassan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/osamasharks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://cal.com/osama-dives"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Book a chat (Cal.com)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/45 font-mono">
          <p>&copy; {new Date().getFullYear()} OsamaDives. Dahab, South Sinai, Egypt.</p>
          <p>PADI MSDT. CDWS registered. 1,000+ Blue Hole dives.</p>
        </div>
      </div>
    </footer>
  );
}
