/**
 * The shore at Dahab, drawn small: sky, the Sinai ridge across the gulf, the sea, the
 * sand, two kites far out, and a diver who walks in from the edge of the screen with his
 * tank on and stops by the temperature. The colours follow the hour in Dahab: day, the
 * golden hour, night. Plain SVG, no library; the motion is CSS and stops for people who
 * asked for less.
 */
export type Phase = "day" | "golden" | "night";

export default function DahabScene({ phase, water, air }: { phase: Phase; water?: number; air?: number }) {
  const sky = phase === "night" ? ["#0f2d4d", "#1f4a73"] : phase === "golden" ? ["#ffb46a", "#ffe6b3"] : ["#78cdf2", "#e6f6fb"];
  const sea = phase === "night" ? ["#153f5e", "#0d2a44"] : phase === "golden" ? ["#3aa5c9", "#1e7fa6"] : ["#46c1e6", "#1f97c4"];
  const sand = phase === "night" ? "#8b7a5a" : phase === "golden" ? "#f4cf8f" : "#f6dfae";
  const ridge = phase === "night" ? "#123553" : phase === "golden" ? "#c9825e" : "#a9b8cf";
  const sunX = phase === "golden" ? 292 : 300, sunY = phase === "golden" ? 74 : 36;
  return (
    <svg className={`scene scene--${phase}`} viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient>
        <linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sea[0]} /><stop offset="1" stopColor={sea[1]} /></linearGradient>
        <radialGradient id="sc-glow"><stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" /><stop offset="1" stopColor="#fff3b0" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="360" height="150" fill="url(#sc-sky)" />
      {phase === "night" ? (
        <g fill="#fff"><circle cx="40" cy="22" r="1.2" /><circle cx="92" cy="14" r="0.9" /><circle cx="150" cy="30" r="1.1" /><circle cx="205" cy="12" r="0.8" /><circle cx="250" cy="26" r="1.2" /><circle cx="310" cy="18" r="0.9" /><circle cx="330" cy="40" r="0.7" /><circle cx="120" cy="48" r="0.7" /></g>
      ) : null}
      {phase === "night" ? (
        <g><circle cx="300" cy="34" r="13" fill="#f6f1d8" /><circle cx="306" cy="30" r="12" fill={sky[0]} /></g>
      ) : (
        <g className="scene__sun"><circle cx={sunX} cy={sunY} r="34" fill="url(#sc-glow)" /><circle cx={sunX} cy={sunY} r={phase === "golden" ? 13 : 11} fill={phase === "golden" ? "#ff9a3c" : "#ffd45e"} /></g>
      )}
      <path d="M0 84 L28 70 L54 78 L86 62 L118 74 L150 66 L184 80 L214 68 L246 78 L280 70 L312 82 L340 72 L360 80 L360 92 L0 92 Z" fill={ridge} opacity={phase === "day" ? 0.55 : 0.8} />
      <g className="scene__kite scene__kite--a" stroke={phase === "night" ? "#9fc7ff" : "#ff5f6d"} strokeWidth="2.2" fill="none" strokeLinecap="round"><path d="M60 58 q9 -9 18 0" /><path d="M69 51 l1 12" strokeWidth="0.8" opacity="0.6" /></g>
      <g className="scene__kite scene__kite--b" stroke={phase === "night" ? "#9fc7ff" : "#ffb84d"} strokeWidth="2" fill="none" strokeLinecap="round"><path d="M132 50 q7 -7 14 0" /><path d="M139 45 l1 10" strokeWidth="0.8" opacity="0.6" /></g>
      <rect x="0" y="88" width="360" height="40" fill="url(#sc-sea)" />
      <g className="scene__waves" fill="none" stroke="#ffffff" strokeOpacity={phase === "night" ? 0.18 : 0.45} strokeWidth="1.4" strokeLinecap="round">
        <path d="M-40 100 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M-60 112 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
      </g>
      <path d="M0 126 Q90 118 180 124 T360 122 L360 150 L0 150 Z" fill={sand} />
      <g className="scene__diver">
        <g transform="translate(228 84)">
          <ellipse cx="6" cy="60" rx="9" ry="2.4" fill="rgba(0,0,0,0.18)" />
          <path className="scene__fin scene__fin--l" d="M-2 56 l-14 3 l14 3 z" fill="#0c6b74" />
          <path className="scene__fin scene__fin--r" d="M12 56 l14 3 l-14 3 z" fill="#0c6b74" />
          <rect className="scene__leg scene__leg--l" x="0" y="38" width="6" height="20" rx="3" fill="#0e2f3d" />
          <rect className="scene__leg scene__leg--r" x="9" y="38" width="6" height="20" rx="3" fill="#0e2f3d" />
          <rect x="15" y="12" width="8" height="26" rx="4" fill="#f2c94c" />
          <rect x="17" y="8" width="4" height="5" rx="1" fill="#9aa3ad" />
          <rect x="-2" y="14" width="19" height="27" rx="7" fill="#0e2f3d" />
          <rect x="4" y="16" width="5" height="22" rx="2.5" fill="#22b3a8" />
          <rect className="scene__arm" x="-6" y="18" width="5" height="16" rx="2.5" fill="#0e2f3d" />
          <path d="M16 16 q6 -6 6 6" stroke="#9aa3ad" strokeWidth="1.6" fill="none" />
          <circle cx="7" cy="7" r="7" fill="#d9a06b" />
          <path d="M0 6 a7 7 0 0 1 14 0 l0 -2 a7 7 0 0 0 -14 0 z" fill="#0e2f3d" />
          <rect x="1" y="-1" width="12" height="4" rx="2" fill="#2fb6d9" />
        </g>
      </g>
      {typeof water === "number" ? <g><rect x="126" y="96" width="62" height="20" rx="10" fill="rgba(255,255,255,0.86)" /><text x="157" y="110" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b4a5a" fontFamily="ui-monospace, monospace">{`water ${water}°`}</text></g> : null}
      {typeof air === "number" ? <g><rect x="176" y="44" width="48" height="20" rx="10" fill="rgba(255,255,255,0.86)" /><text x="200" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8a4b12" fontFamily="ui-monospace, monospace">{`air ${air}°`}</text></g> : null}
    </svg>
  );
}
