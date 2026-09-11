/**
 * Dahab drawn small, the way a phone's weather widget draws a day: a bright sky with the
 * sun and slow clouds, birds, the Sinai ridge across the gulf, kites, the sea with a
 * fishing boat on it, the sand, a palm, and a diver who walks in from off the edge with
 * his tank on, stops, photographs the water temperature, and gives the OK before
 * he settles. The colours follow the hour in Dahab: day, the golden hour, night.
 *
 * Plain SVG and CSS keyframes, no library. Every moving part runs off one sixteen second
 * cycle so the acts land in order, and every one of them reads --play, so nothing moves
 * until the card is actually on a screen. It all stops for anyone who asked for less
 * motion.
 */
export type Phase = "day" | "golden" | "night";

export default function DahabScene({ phase, water, air }: { phase: Phase; water?: number; air?: number }) {
  const night = phase === "night", golden = phase === "golden";
  // Bright and full of sun for the day, warm for the golden hour, deep but never black at
  // night. Most of the people reading this are somewhere with no sun.
  const sky = night ? ["#0d2a4a", "#1d4f78", "#2f6d92"] : golden ? ["#ff8f4e", "#ffb069", "#ffe3b0"] : ["#2fb3ef", "#8ddcf6", "#dff4fc"];
  const sea = night ? ["#12466a", "#0a2a45"] : golden ? ["#2f92bb", "#15607f"] : ["#27b0e0", "#0d7cb0"];
  const sand = night ? "#7d7057" : golden ? "#f2c98b" : "#f8e3ae";
  const ridgeFar = night ? "#16405f" : golden ? "#d9a17c" : "#b7c8dc";
  const ridgeNear = night ? "#0f3550" : golden ? "#b9764f" : "#93a9c6";
  const palm = night ? "#13503f" : golden ? "#2c7a53" : "#2f9160";
  const sunX = golden ? 296 : 300, sunY = golden ? 78 : 32;

  return (
    <svg className={`scene scene--${phase}`} viewBox="0 0 360 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} /><stop offset="0.6" stopColor={sky[1]} /><stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sea[0]} /><stop offset="1" stopColor={sea[1]} /></linearGradient>
        <radialGradient id="sc-glow"><stop offset="0" stopColor="#fff6c4" stopOpacity="0.95" /><stop offset="1" stopColor="#fff6c4" stopOpacity="0" /></radialGradient>
      </defs>

      <rect width="360" height="170" fill="url(#sc-sky)" />

      {night ? (
        <g fill="#fff" opacity="0.9">
          <circle cx="40" cy="22" r="1.2" /><circle cx="92" cy="14" r="0.9" /><circle cx="150" cy="30" r="1.1" />
          <circle cx="205" cy="12" r="0.8" /><circle cx="250" cy="26" r="1.2" /><circle cx="330" cy="44" r="0.7" />
          <circle cx="120" cy="50" r="0.7" /><circle cx="186" cy="56" r="0.8" /><circle cx="64" cy="44" r="0.8" />
        </g>
      ) : null}

      {night ? (
        <g><circle cx="300" cy="34" r="13" fill="#f7f2da" /><circle cx="306" cy="30" r="12" fill={sky[0]} /></g>
      ) : (
        <g className="scene__sun">
          <circle cx={sunX} cy={sunY} r="40" fill="url(#sc-glow)" />
          <circle cx={sunX} cy={sunY} r={golden ? 15 : 12} fill={golden ? "#ff8f3c" : "#ffd24a"} />
        </g>
      )}

      {/* clouds: slow, soft, and out of the clock's way */}
      <g fill={night ? "#2b5f88" : "#ffffff"} opacity={night ? 0.5 : 0.85}>
        <g className="scene__cloud scene__cloud--a">
          <ellipse cx="86" cy="30" rx="19" ry="7.5" /><ellipse cx="72" cy="33" rx="13" ry="6" /><ellipse cx="101" cy="33" rx="12" ry="5.5" />
        </g>
        <g className="scene__cloud scene__cloud--b">
          <ellipse cx="212" cy="20" rx="14" ry="5.5" /><ellipse cx="201" cy="23" rx="10" ry="4.5" />
        </g>
      </g>

      {/* two birds, far off */}
      <g className="scene__bird" stroke={night ? "#8fb8de" : "#2b566f"} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.75">
        <path d="M118 46 q4 -3.5 8 0" /><path d="M126 46 q4 -3.5 8 0" />
        <path d="M136 54 q3 -2.6 6 0" />
      </g>

      {/* the Sinai ridge across the gulf, two ranges deep */}
      <path d="M0 90 L30 74 L58 82 L92 64 L126 78 L158 70 L190 84 L222 70 L256 80 L292 68 L324 84 L360 74 L360 104 L0 104 Z" fill={ridgeFar} opacity={night ? 0.85 : 0.55} />
      <path d="M0 98 L26 88 L52 95 L84 84 L118 96 L150 88 L188 98 L214 90 L248 98 L286 88 L318 98 L360 92 L360 104 L0 104 Z" fill={ridgeNear} opacity={night ? 0.95 : 0.72} />

      {/* the kites he wanted, small and far out */}
      <g className="scene__kite scene__kite--a" stroke={night ? "#9fc7ff" : "#ff4f64"} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M64 54 q10 -10 20 0" /><path d="M74 47 l1 13" strokeWidth="0.8" opacity="0.6" />
      </g>
      <g className="scene__kite scene__kite--b" stroke={night ? "#9fc7ff" : "#ffb020"} strokeWidth="2.1" fill="none" strokeLinecap="round">
        <path d="M158 44 q8 -8 16 0" /><path d="M166 39 l1 11" strokeWidth="0.8" opacity="0.6" />
      </g>

      <rect x="0" y="102" width="360" height="40" fill="url(#sc-sea)" />

      {/* a fishing boat out on the water, rocking */}
      <g className="scene__boat" opacity={night ? 0.7 : 0.9}>
        <path d="M268 116 l18 0 l-3 5 l-12 0 z" fill={night ? "#0e3a57" : "#20374d"} />
        <path d="M276 116 l0 -9 l7 9 z" fill={night ? "#7fb6d8" : "#ffffff"} />
      </g>

      <g className="scene__waves" fill="none" stroke="#ffffff" strokeOpacity={night ? 0.2 : 0.5} strokeWidth="1.5" strokeLinecap="round">
        <path d="M-40 114 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M-60 128 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
      </g>

      <path d="M0 140 Q90 132 180 138 T360 136 L360 170 L0 170 Z" fill={sand} />

      {/* a palm at the right edge, leaning off the frame the way they do on that shore */}
      <g className="scene__palm">
        <path d="M320 168 q-5 -22 2 -40" stroke={night ? "#4a3f2c" : "#8a6b46"} strokeWidth="4" fill="none" strokeLinecap="round" />
        <g className="scene__fronds" fill={palm}>
          <path d="M322 128 q-17 -5 -25 5 q14 -2 25 -1 z" />
          <path d="M322 128 q-8 -16 -22 -18 q9 10 20 19 z" />
          <path d="M322 128 q13 -13 27 -9 q-14 4 -25 10 z" />
          <path d="M322 128 q16 3 21 15 q-12 -9 -22 -12 z" />
        </g>
      </g>

      {/* the diver: the outer group walks him in, the inner one gives him his breathing */}
      <g className="scene__walk">
        <g className="scene__bob">
          <g transform="translate(104 96)">
            <ellipse className="scene__shadow" cx="8" cy="64" rx="12" ry="3" fill="rgba(0,0,0,0.16)" />
            <path className="scene__fin scene__fin--l" d="M-1 59 l-16 4 l16 4 z" fill="#0b6f78" />
            <path className="scene__fin scene__fin--r" d="M14 59 l16 4 l-16 4 z" fill="#0b6f78" />
            <rect className="scene__leg scene__leg--l" x="1" y="39" width="7" height="22" rx="3.5" fill="#12303f" />
            <rect className="scene__leg scene__leg--r" x="11" y="39" width="7" height="22" rx="3.5" fill="#12303f" />
            {/* tank, harness, wetsuit */}
            <rect x="17" y="11" width="9" height="29" rx="4.5" fill="#f4c542" />
            <rect x="19" y="6" width="5" height="6" rx="1.5" fill="#9aa3ad" />
            <rect x="-2" y="13" width="21" height="29" rx="8" fill="#12303f" />
            <rect x="5" y="15" width="5" height="24" rx="2.5" fill="#23bdb0" />
            <path d="M18 15 q7 -6 6 7" stroke="#9aa3ad" strokeWidth="1.8" fill="none" />
            {/* the arm that does the work: it swings, lifts a camera, then gives the OK */}
            <g className="scene__arm">
              <rect x="-7" y="17" width="5.5" height="18" rx="2.75" fill="#12303f" />
              <g className="scene__cam"><rect x="-12" y="12" width="11" height="8" rx="2" fill="#20303a" /><circle cx="-6.5" cy="16" r="2.6" fill="#7fd3e8" /><rect x="-10" y="10" width="4" height="2" rx="1" fill="#20303a" /></g>
              {/* the sign every diver knows, given on the same raised arm */}
              <g className="scene__ok" stroke="#d9a06b" fill="none" strokeLinecap="round">
                <circle cx="-8.5" cy="16" r="3.4" strokeWidth="2.2" />
                <path d="M-10.5 11.6 l-1.2 -4" strokeWidth="2" /><path d="M-7.8 11.4 l0.4 -4.2" strokeWidth="2" /><path d="M-5.2 12 l1.6 -3.4" strokeWidth="2" />
              </g>
            </g>
            {/* head, hood, mask */}
            <circle cx="8" cy="7" r="7.4" fill="#d9a06b" />
            <path d="M0.6 6 a7.4 7.4 0 0 1 14.8 0 l0 -2.2 a7.4 7.4 0 0 0 -14.8 0 z" fill="#12303f" />
            <rect x="2" y="-1.4" width="13" height="4.6" rx="2.3" fill="#31bde0" />
          </g>
        </g>
      </g>

      {/* what he came to read. The water pill is the one he photographs. */}
      {typeof water === "number" ? (
        <g className="scene__tagwrap">
          <circle className="scene__flash" cx="228" cy="118" r="20" fill="none" stroke="#ffffff" strokeWidth="3" />
          <g className="scene__tag">
            <rect x="192" y="107" width="72" height="22" rx="11" fill="rgba(255,255,255,0.92)" />
            <text x="228" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0b4a5a" fontFamily="ui-monospace, monospace">{`water ${water}°`}</text>
          </g>
        </g>
      ) : null}
      {typeof air === "number" ? (
        <g>
          <rect x="20" y="64" width="58" height="21" rx="10.5" fill="rgba(255,255,255,0.9)" />
          <text x="49" y="79" textAnchor="middle" fontSize="12" fontWeight="700" fill="#8a4b12" fontFamily="ui-monospace, monospace">{`air ${air}°`}</text>
        </g>
      ) : null}
    </svg>
  );
}
