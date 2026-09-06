import type { CSSProperties } from "react";

/**
 * A year that rolls like a mechanical odometer as the reader scrolls through a
 * pinned act: each digit is its own vertical reel turning at its own natural
 * speed (the ones place spins fastest, the thousands place barely moves), the
 * way a car's trip counter turns over. It is driven entirely by the --sc-p the
 * wheel already writes on the enclosing act, through plain CSS calc(), so it
 * needs no script of its own and reverses cleanly when the reader scrolls back.
 */
export default function OdometerYear({
  from,
  to,
  at = [0.1, 0.86],
  parallax,
  className = "",
}: {
  from: number;
  to: number;
  at?: [number, number];
  parallax?: number;
  className?: string;
}) {
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);
  const places = [1000, 100, 10, 1];
  const style = {
    "--od-from": from,
    "--od-span": to - from,
    "--od-at0": at[0],
    "--od-at1": at[1] - at[0],
  } as CSSProperties;

  return (
    <div
      className={`odometer ${className}`.trim()}
      style={style}
      data-sc-parallax={parallax !== undefined ? parallax : undefined}
      aria-hidden="true"
    >
      {places.map((place) => {
        const minPos = Math.floor(lo / place);
        const maxPos = Math.ceil(hi / place);
        const slots: number[] = [];
        for (let k = minPos; k <= maxPos; k++) slots.push(((k % 10) + 10) % 10);
        return (
          <span className="odometer__digit" key={place} data-od-p={place} style={{ "--od-place": place, "--od-min": minPos } as CSSProperties}>
            <span className="odometer__reel">
              {slots.map((d, i) => (
                <span className="odometer__n" key={i}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
}
