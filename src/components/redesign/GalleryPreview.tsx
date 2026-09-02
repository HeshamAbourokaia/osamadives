import Image from "next/image";
import Link from "next/link";

interface Tile {
  src: string;
  alt: string;
  span: string;
}

const tiles: Tile[] = [
  {
    src: "/images/OsamaDives_Him_Self.jpeg",
    alt: "Portrait of Osama",
    span: "row-span-2",
  },
  {
    src: "/images/Osama7Tanks.jpeg",
    alt: "Osama with sidemount tanks before a tech dive",
    span: "",
  },
  {
    src: "/images/OsamaDives_The_Blue_Hole.jpeg",
    alt: "The Blue Hole, Dahab",
    span: "",
  },
  {
    src: "/images/OsamDives_The_Canyon.jpg",
    alt: "Diving the Canyon",
    span: "col-span-2",
  },
  {
    src: "/images/Camels.jpeg",
    alt: "Camel safari to Ras Abu Galum",
    span: "",
  },
  {
    src: "/images/FB_IMG_1625154352007.jpg",
    alt: "Three Pools coral garden",
    span: "",
  },
];

export default function GalleryPreview() {
  return (
    <section id="gallery-preview" className="bg-bone py-24 sm:py-32 px-5 sm:px-10 scroll-mt-20">
      <div className="max-w-editorial mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="label-eyebrow text-reef mb-4">06. Gallery</p>
            <h2 className="font-display text-abyss text-4xl sm:text-6xl leading-[1.05] max-w-2xl">
              The sea, on film.
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-reef hover:text-abyss transition-colors"
          >
            View the full gallery
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] sm:auto-rows-[240px]">
          {tiles.map((tile, i) => (
            <div
              key={i}
              className={`relative overflow-hidden bg-abyss/10 rounded-sm ${tile.span}`}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
