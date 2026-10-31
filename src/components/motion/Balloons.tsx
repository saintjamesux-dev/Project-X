import { seeded, range } from "@/lib/random";

/** Jewel tones with a highlight colour for the glossy sheen. */
const PALETTE = [
  { base: "#c9a35f", light: "#f6e3b4", dark: "#6e5426" }, // champagne
  { base: "#e9e1d2", light: "#ffffff", dark: "#8f8576" }, // pearl
  { base: "#7a2236", light: "#d2768a", dark: "#3a0c18" }, // garnet
  { base: "#24386e", light: "#7a93d6", dark: "#0d1838" }, // sapphire
  { base: "#b9807f", light: "#f3c7c2", dark: "#5c3434" }, // rose
  { base: "#2f5e4e", light: "#82b8a3", dark: "#11291f" }, // emerald
];

type BalloonSpec = {
  id: number;
  left: number;
  size: number;
  dur: number;
  delay: number;
  sway: number;
  drift: number;
  depth: "back" | "front";
  color: (typeof PALETTE)[number];
  rest: number;
};

function makeBalloons(count: number): BalloonSpec[] {
  const rand = seeded(9071);
  return Array.from({ length: count }, (_, i) => {
    const front = i % 4 === 0;
    // Front-layer balloons keep to the edges so they never cover the headline.
    const left = front ? (i % 8 === 0 ? range(rand, -2, 12) : range(rand, 84, 96)) : range(rand, 2, 94);
    const size = front ? range(rand, 78, 112) : range(rand, 38, 74);
    return {
      id: i,
      left,
      size,
      dur: front ? range(rand, 9, 12) : range(rand, 11, 17),
      // Most of the first wave launches within two seconds; the rest follow to keep the sky alive.
      delay: i < 10 ? range(rand, 0, 1.8) : range(rand, 2.5, 7),
      sway: range(rand, 2.6, 4.6),
      drift: range(rand, 8, 22),
      depth: front ? "front" : "back",
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
      rest: range(rand, -24, 2),
    };
  });
}

function Balloon({ spec }: { spec: BalloonSpec }) {
  const { color, size, id } = spec;
  const gid = `bg-${id}`;
  const hid = `bh-${id}`;
  return (
    <div
      className="balloon"
      data-depth={spec.depth}
      style={
        {
          left: `${spec.left}%`,
          width: size,
          "--dur": `${spec.dur}s`,
          "--delay": `${spec.delay}s`,
          "--sway": `${spec.sway}s`,
          "--drift": `${spec.drift}px`,
          "--rest": `${spec.rest}vh`,
          opacity: spec.depth === "back" ? 0.55 : 0.95,
          filter: spec.depth === "back" ? `blur(${size < 50 ? 2 : 1}px)` : undefined,
        } as React.CSSProperties
      }
    >
      <div className="balloon-sway">
        <svg viewBox="0 0 100 200" width={size} height={size * 2} aria-hidden>
          <defs>
            <radialGradient id={gid} cx="36%" cy="30%" r="75%">
              <stop offset="0%" stopColor={color.light} />
              <stop offset="35%" stopColor={color.base} />
              <stop offset="100%" stopColor={color.dark} />
            </radialGradient>
            <radialGradient id={hid} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M50 4 C78 4 96 28 96 56 C96 88 70 112 52 118 L48 118 C30 112 4 88 4 56 C4 28 22 4 50 4 Z" fill={`url(#${gid})`} />
          <ellipse cx="34" cy="34" rx="12" ry="18" fill={`url(#${hid})`} transform="rotate(-24 34 34)" />
          <path d="M45 118 L55 118 L52 125 L48 125 Z" fill={color.dark} />
          <path
            d="M50 125 C44 140 58 152 50 166 C43 178 56 188 50 200"
            stroke="rgba(236,217,176,0.45)"
            strokeWidth="0.9"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

const BALLOONS = makeBalloons(16);

/** Balloons rising behind (and, at the edges, in front of) the hero. */
export function Balloons({ layer }: { layer: "back" | "front" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BALLOONS.filter((b) => b.depth === layer).map((b) => (
        <Balloon key={b.id} spec={b} />
      ))}
    </div>
  );
}
