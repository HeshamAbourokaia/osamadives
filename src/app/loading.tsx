export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-abyss flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-white text-4xl sm:text-5xl tracking-tight animate-pulse">
          OsamaDives
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45">
          Dahab. Since 1983.
        </p>
      </div>
    </div>
  );
}
