/**
 * Bathymetric contours for the paper acts: the depth lines of a nautical chart, faint
 * on the bone, drifting a little with the scroll. Each hill is a set of nested rings
 * that share one set of harmonics, so they read as the contours of one rise in the
 * seabed rather than as separate blobs. Drawn twice: the second copy is brighter and
 * masked to a circle around the pointer, so on a desk the chart lights where the
 * hand is. Deterministic from the seed, so the server and the browser agree.
 */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Hill { x: number; y: number; rings: number; base: number; step: number; labels: [number, string][] }

function chart(seed: number, hills: Hill[]) {
  const rnd = prng(seed);
  const paths: string[] = [];
  const labels: { x: number; y: number; text: string }[] = [];
  for (const h of hills) {
    const harm = [1, 2, 3, 5].map((k) => ({ k, a: (0.16 / k) * (0.6 + rnd() * 0.8), p: rnd() * Math.PI * 2 }));
    const labelAt = new Map(h.labels);
    for (let r = 0; r < h.rings; r++) {
      const R = h.base + h.step * r;
      const pts: string[] = [];
      let lx = 0, ly = 0;
      for (let i = 0; i < 96; i++) {
        const th = (i / 96) * Math.PI * 2;
        let f = 1;
        for (const m of harm) f += m.a * Math.sin(m.k * th + m.p) * (0.5 + (r / h.rings) * 0.9);
        const x = h.x + Math.cos(th) * R * f;
        const y = h.y + Math.sin(th) * R * f * 0.62;
        pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
        if (i === 20) { lx = x; ly = y; }
      }
      paths.push(pts.join("") + "Z");
      const t = labelAt.get(r);
      if (t) labels.push({ x: lx, y: ly, text: t });
    }
  }
  return { paths, labels };
}

const HILLS: Hill[] = [
  { x: 330, y: 260, rings: 7, base: 46, step: 58, labels: [[1, "5 m"], [3, "12 m"], [5, "22 m"]] },
  { x: 1180, y: 700, rings: 6, base: 60, step: 66, labels: [[2, "8 m"], [4, "18 m"]] },
  { x: 1420, y: 140, rings: 4, base: 40, step: 62, labels: [[3, "30 m"]] },
];

export default function Contours({ seed = 3, glow = true }: { seed?: number; glow?: boolean }) {
  const { paths, labels } = chart(seed, HILLS);
  const body = (
    <>
      {paths.map((d, i) => <path key={i} d={d} />)}
      {labels.map((l, i) => (
        <text key={i} x={l.x + 6} y={l.y - 4}>{l.text}</text>
      ))}
    </>
  );
  return (
    <div className="contours" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="contours__lines">{body}</svg>
      {glow ? <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="contours__lines contours__glow">{body}</svg> : null}
    </div>
  );
}
