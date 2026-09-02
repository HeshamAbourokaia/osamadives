import Image from "next/image";

export default function BedouinMoment() {
  return (
    <section className="relative w-full min-h-[75vh] flex items-end px-6 py-20 overflow-hidden">
      <Image
        src="/images/Camels.jpeg"
        alt="Bedouin camel caravan along the Sinai coast"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto text-center sm:text-left">
        <p className="font-display text-white text-2xl sm:text-3xl md:text-4xl leading-snug">
          Before trucks, before cars, Bedouins crossed Sinai by camel. Some reefs
          you still get to that way.
        </p>
      </div>
    </section>
  );
}
