import type { CSSProperties } from "react";

/**
 * A headline whose words rise one by one out of slots cut in the line.
 *
 * In a pinned act the wheel drives it: each word reads the act's --sc-p and rises
 * across its own window, so scrolling back lowers it again. `at` is where in the
 * act the first word starts, `step` the gap between words, `win` how much progress
 * one word takes to rise. In a flow act (mode "in") the words rise once, when the
 * engine marks the block as in view, with a fixed delay per word.
 */
export default function Words({
  text,
  mode = "p",
  at = 0,
  step = 0.012,
  win = 0.06,
}: {
  text: string;
  mode?: "p" | "in";
  at?: number;
  step?: number;
  win?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={`w-host w-host--${mode}`} style={{ "--w-at": at, "--w-step": step, "--w-win": win } as CSSProperties}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="w">
            <span className="w__i" style={{ "--i": i } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
