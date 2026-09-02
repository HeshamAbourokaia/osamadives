import FeaturedReel from "@/components/FeaturedReel";
import InstagramFeed from "@/components/InstagramFeed";

/**
 * Cinematic dark wrapper around the existing Behold widgets.
 * Preserves the widget plumbing in FeaturedReel and InstagramFeed.
 */
export default function LiveFromReef() {
  return (
    <section
      id="live"
      className="bg-abyss text-white px-0 py-0 scroll-mt-20 overflow-hidden border-y border-white/5"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-20 pb-10">
        <p className="label-eyebrow text-sun-glint mb-4">04. Live from the reef</p>
        <h2 className="font-display text-4xl sm:text-6xl leading-[1.05] mb-4 max-w-3xl">
          What I posted
          <br />
          this week.
        </h2>
        <p className="text-white/65 max-w-xl text-lg leading-relaxed">
          A working dive log, straight from Instagram. It rotates whenever I
          surface and post.
        </p>
      </div>
      {/* Existing FeaturedReel keeps its dark earthy theme; renders inside a wider abyss frame. */}
      <FeaturedReel />
      {/* Existing white InstagramFeed gives breathing room between the theatre sections. */}
      <div className="bg-bone">
        <InstagramFeed />
      </div>
    </section>
  );
}
