import { forwardRef } from "react";

export type CandlePhase = "lit" | "blowing" | "out";

const W = 400;
const H = 440;

// Bottom tier
const B = { cx: 200, rx: 140, ry: 18, top: 262, bottom: 390 };
// Top tier
const T = { cx: 200, rx: 90, ry: 12, top: 170, bottom: 266 };

const rimY = (x: number, tier: { cx: number; rx: number; ry: number }, y: number) =>
  y + tier.ry * Math.sqrt(Math.max(0, 1 - ((x - tier.cx) / tier.rx) ** 2));

const CANDLE_H = 64;
const CANDLE_W = 10;
const FLAME_W = 17;
const FLAME_H = 36;

function candlePositions(count: number) {
  const spread = Math.min(count - 1, 6) * 25;
  return Array.from({ length: count }, (_, i) => {
    const x = count === 1 ? 200 : 200 - spread / 2 + (spread / (count - 1)) * i;
    // Centre candles sit slightly forward on the top surface
    const base = T.top + 6 - Math.abs(x - 200) * 0.05;
    return { x, base, top: base - CANDLE_H + (i % 2 ? 4 : 0) };
  });
}

/** Ganache-style glaze across the top tier with irregular drips. */
function glazePath() {
  const drips = [
    [122, 18], [138, 30], [154, 14], [170, 38], [188, 22], [204, 44], [220, 18], [236, 34], [252, 16], [268, 26], [281, 12],
  ];
  const w = 9;
  let d = `M ${T.cx - T.rx} ${T.top} `;
  for (const [cx, len] of drips) {
    const y0 = rimY(cx - w / 2, T, T.top);
    const y1 = rimY(cx + w / 2, T, T.top);
    d += `L ${cx - w / 2} ${y0} L ${cx - w / 2} ${y0 + len} A ${w / 2} ${w / 2} 0 0 0 ${cx + w / 2} ${y1 + len} L ${cx + w / 2} ${y1} `;
  }
  d += `L ${T.cx + T.rx} ${T.top} A ${T.rx} ${T.ry} 0 0 0 ${T.cx - T.rx} ${T.top} Z`;
  return d;
}

function pearls(tier: { cx: number; rx: number; ry: number }, y: number, step: number, inset: number) {
  const out: { x: number; y: number }[] = [];
  for (let x = tier.cx - tier.rx + inset; x <= tier.cx + tier.rx - inset; x += step) {
    out.push({ x, y: rimY(x, tier, y) - 3 });
  }
  return out;
}

function swags() {
  const count = 7;
  const width = (B.rx * 2) / count;
  return Array.from({ length: count }, (_, k) => {
    const x0 = B.cx - B.rx + k * width;
    const x1 = x0 + width;
    const y0 = rimY(x0, B, B.top) + 2;
    const y1 = rimY(x1, B, B.top) + 2;
    const yc = Math.max(y0, y1) + 30;
    return { d: `M ${x0} ${y0} Q ${(x0 + x1) / 2} ${yc} ${x1} ${y1}`, x: x1, y: y1 };
  });
}

type CakeProps = { candles: number; phase: CandlePhase; smokeKey: number };

export const Cake = forwardRef<HTMLDivElement, CakeProps>(function Cake({ candles, phase, smokeKey }, ref) {
  const positions = candlePositions(candles);
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div ref={ref} className={`relative w-full candles-${phase}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label="A two-tier ivory birthday cake with gold detailing and lit candles">
        <defs>
          <linearGradient id="fondant" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8f8371" />
            <stop offset="0.12" stopColor="#d3c6b1" />
            <stop offset="0.42" stopColor="#f8f1e4" />
            <stop offset="0.6" stopColor="#efe5d4" />
            <stop offset="0.9" stopColor="#b6a88f" />
            <stop offset="1" stopColor="#6f6455" />
          </linearGradient>
          <linearGradient id="fondant-top" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="1" stopColor="#e3d7c3" />
          </linearGradient>
          <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fbe7b5" />
            <stop offset="0.45" stopColor="#d8b878" />
            <stop offset="1" stopColor="#8d6a32" />
          </linearGradient>
          <linearGradient id="gold-h" x1="0" x2="1">
            <stop offset="0" stopColor="#7d5c28" />
            <stop offset="0.35" stopColor="#e9cf95" />
            <stop offset="0.55" stopColor="#fff0c8" />
            <stop offset="1" stopColor="#7d5c28" />
          </linearGradient>
          <linearGradient id="stand" x1="0" x2="1">
            <stop offset="0" stopColor="#3a2c18" />
            <stop offset="0.4" stopColor="#c9a35f" />
            <stop offset="0.55" stopColor="#f1d9a2" />
            <stop offset="1" stopColor="#3a2c18" />
          </linearGradient>
          <pattern id="candle-stripes" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
            <rect width="9" height="9" fill="#f6efe2" />
            <rect width="3" height="9" fill="#d8b878" />
          </pattern>
          <linearGradient id="candle-shade" x1="0" x2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.35" />
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="warm-light" cx="50%" cy="45%" r="50%">
            <stop offset="0" stopColor="#ffcf8a" stopOpacity="0.28" />
            <stop offset="0.6" stopColor="#ffcf8a" stopOpacity="0.08" />
            <stop offset="1" stopColor="#ffcf8a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Stand */}
        <ellipse cx="200" cy="436" rx="78" ry="6" fill="#000" opacity="0.6" />
        <path d="M 168 400 C 176 412 180 420 150 428 L 250 428 C 220 420 224 412 232 400 Z" fill="url(#stand)" />
        <ellipse cx="200" cy="428" rx="50" ry="6" fill="url(#stand)" />
        <ellipse cx="200" cy="396" rx="172" ry="22" fill="url(#stand)" />
        <ellipse cx="200" cy="392" rx="168" ry="19" fill="#1b140c" opacity="0.55" />

        {/* Bottom tier */}
        <path
          d={`M ${B.cx - B.rx} ${B.top} L ${B.cx - B.rx} ${B.bottom} A ${B.rx} ${B.ry} 0 0 0 ${B.cx + B.rx} ${B.bottom} L ${B.cx + B.rx} ${B.top} Z`}
          fill="url(#fondant)"
        />
        <path
          d={`M ${B.cx - B.rx} ${B.bottom - 22} A ${B.rx} ${B.ry} 0 0 0 ${B.cx + B.rx} ${B.bottom - 22} L ${B.cx + B.rx} ${B.bottom - 14} A ${B.rx} ${B.ry} 0 0 1 ${B.cx - B.rx} ${B.bottom - 14} Z`}
          fill="url(#gold-h)"
        />
        <ellipse cx={B.cx} cy={B.top} rx={B.rx} ry={B.ry} fill="url(#fondant-top)" />
        {swags().map((s, i) => (
          <g key={i}>
            <path d={s.d} stroke="url(#gold)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            {i < 6 && <circle cx={s.x} cy={s.y + 1} r="3.4" fill="url(#gold)" />}
          </g>
        ))}
        {pearls(B, B.bottom, 11, 6).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fbf6ec" stroke="#cdbfa8" strokeWidth="0.6" />
        ))}

        {/* Top tier */}
        <path
          d={`M ${T.cx - T.rx} ${T.top} L ${T.cx - T.rx} ${T.bottom} A ${T.rx} ${T.ry} 0 0 0 ${T.cx + T.rx} ${T.bottom} L ${T.cx + T.rx} ${T.top} Z`}
          fill="url(#fondant)"
        />
        {pearls(T, T.bottom, 9, 5).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fbf6ec" stroke="#cdbfa8" strokeWidth="0.5" />
        ))}
        {/* Gold leaf */}
        {[
          [132, 222, 0.9], [252, 212, 1.1], [214, 236, 0.7], [160, 248, 0.6], [268, 244, 0.8],
        ].map(([x, y, s], i) => (
          <path
            key={i}
            d="M0 0 L6 -3 L11 1 L8 6 L2 5 Z"
            transform={`translate(${x} ${y}) scale(${s}) rotate(${i * 37})`}
            fill="url(#gold)"
            opacity="0.85"
          />
        ))}
        <path d={glazePath()} fill="url(#gold)" />
        <ellipse cx={T.cx} cy={T.top} rx={T.rx - 3} ry={T.ry - 2} fill="#f2d9a0" opacity="0.35" />

        {/* Candles */}
        {positions.map((c, i) => (
          <g key={i}>
            <rect x={c.x - CANDLE_W / 2} y={c.top} width={CANDLE_W} height={c.base - c.top} rx="2" fill="url(#candle-stripes)" />
            <rect x={c.x - CANDLE_W / 2} y={c.top} width={CANDLE_W} height={c.base - c.top} rx="2" fill="url(#candle-shade)" />
            <ellipse cx={c.x} cy={c.top} rx={CANDLE_W / 2} ry="1.6" fill="#fffaf0" />
            <path d={`M ${c.x} ${c.top} q 1 -4 -0.5 -7`} stroke="#2a1d14" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>
        ))}

        {/* Warm light falling on the cake while the candles burn */}
        <ellipse
          cx="200"
          cy="240"
          rx="190"
          ry="170"
          fill="url(#warm-light)"
          style={{ opacity: phase === "lit" ? 1 : 0, transition: "opacity 1.2s ease-out" }}
        />

        {/* Breath across the candles */}
        {phase === "blowing" && (
          <g stroke="rgba(244,238,227,0.55)" strokeWidth="1.4" fill="none" strokeLinecap="round">
            <path className="wind-line" d="M -30 96 C 60 86 120 104 200 94 S 330 86 420 98" />
            <path className="wind-line" style={{ animationDelay: "0.12s" }} d="M -30 116 C 70 108 140 124 210 114 S 340 108 430 118" />
            <path className="wind-line" style={{ animationDelay: "0.22s" }} d="M -30 136 C 80 128 150 142 220 134 S 350 128 430 138" />
          </g>
        )}
      </svg>

      {/* Flames and smoke, layered as HTML for natural glow */}
      {positions.map((c, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute -translate-x-1/2"
          style={{
            left: pct(c.x, W),
            top: pct(c.top - 7 - FLAME_H + 3, H),
            width: pct(FLAME_W, W),
            height: pct(FLAME_H, H),
          }}
        >
          <div className="flame-glow" style={{ "--flicker": `${1.3 + (i % 3) * 0.27}s` } as React.CSSProperties} />
          <div className="flame" style={{ "--flicker": `${1.3 + (i % 3) * 0.27}s`, transitionDelay: `${i * 60}ms` } as React.CSSProperties}>
            <div className="flame-core" />
          </div>
          {phase === "out" && (
            <div key={smokeKey} className="absolute inset-x-0 bottom-0 h-full">
              {[0, 1, 2].map((s) => (
                <span
                  key={s}
                  className="smoke"
                  style={{ animationDelay: `${0.1 + s * 0.35 + i * 0.05}s`, "--smoke-x": `${(s - 1) * 8 + 6}px` } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
