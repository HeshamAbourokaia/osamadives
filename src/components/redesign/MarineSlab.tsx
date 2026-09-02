import Image from "next/image";

export default function MarineSlab() {
  return (
    <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
      <Image
        src="/images/FB_IMG_1638331910256.jpg"
        alt="A diver beside a giant gorgonian sea fan on a Red Sea reef in Dahab"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-abyss/55" />
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <p className="font-display text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl text-balance">
          1,000+ species.
          <br />
          200+ corals.
          <br />
          <span className="text-sun-glint">One sea.</span>
        </p>
      </div>
    </section>
  );
}
