"use client";

// The years under the photographs: press one and the page scrolls to that moment of the act.
export default function PeakYears({ years }: { years: { year: string; at: number }[] }) {
  const go = (at: number) => () => {
    const act = document.getElementById("peak-act");
    if (!act) return;
    const r = act.getBoundingClientRect();
    const top = r.top + window.scrollY + Math.max(0, r.height - window.innerHeight) * at;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };
  return (
    <div className="peak-years" role="group" aria-label="Years">
      {years.map((y) => (
        <button key={y.year} type="button" className="peak-year-chip mono" onClick={go(y.at)} data-at={y.at}>{y.year}</button>
      ))}
    </div>
  );
}
