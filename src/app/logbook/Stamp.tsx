import { stampInfo } from "@/lib/logbook/stamps";
import type { StampKey } from "@/lib/logbook/types";

interface Props {
  stamp: StampKey;
  uid: string;
  className?: string;
}

// A rubber stamp: two rings, the ring text on a circular path, the label in the middle.
// Pure SVG, coloured by currentColor, so it inks in whatever sits around it.
export default function Stamp({ stamp, uid, className }: Props) {
  const info = stampInfo(stamp);
  const words = info.label.split(" ");
  const lines = words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : words.length === 2 ? words : [info.label];
  const pathId = `lb-ring-${uid}`;
  return (
    <span className={className ? `lb-stamp ${className}` : "lb-stamp"} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id={pathId} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="5" />
        <circle cx="100" cy="100" r="52" stroke="currentColor" strokeWidth="2" />
        <text fill="currentColor" fontFamily="var(--mono)" fontSize="12.5" fontWeight="500" letterSpacing="2.4">
          <textPath href={`#${pathId}`} startOffset="0">{info.ring} ·</textPath>
        </text>
        <text x="100" y={lines.length > 1 ? 96 : 105} textAnchor="middle" fill="currentColor" fontFamily="var(--display)" fontWeight="800" fontSize={lines.some((l) => l.length > 9) ? 15 : 18} style={{ textTransform: "uppercase", letterSpacing: "-0.01em" }}>
          {lines.map((line, i) => (
            <tspan key={line} x="100" dy={i === 0 ? 0 : 19}>{line}</tspan>
          ))}
        </text>
        <text x="100" y="132" textAnchor="middle" fill="currentColor" fontFamily="var(--mono)" fontSize="9" letterSpacing="3">DAHAB</text>
      </svg>
    </span>
  );
}
