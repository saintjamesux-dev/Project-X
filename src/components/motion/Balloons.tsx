"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
type Colour = (typeof PALETTE)[number];

/** How long the opening cluster lasts before it has fully popped (ms). */
export const ENTRY_POP_DONE = 2600;

function BalloonSvg({ color, id }: { color: Colour; id: string }) {
  return (
    <svg viewBox="0 0 100 200" className="block h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id={`g-${id}`} cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor={color.light} />
          <stop offset="35%" stopColor={color.base} />
          <stop offset="100%" stopColor={color.dark} />
        </radialGradient>
        <radialGradient id={`h-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M50 4 C78 4 96 28 96 56 C96 88 70 112 52 118 L48 118 C30 112 4 88 4 56 C4 28 22 4 50 4 Z" fill={`url(#g-${id})`} />
      <ellipse cx="34" cy="34" rx="12" ry="18" fill={`url(#h-${id})`} transform="rotate(-24 34 34)" />
      <path d="M45 118 L55 118 L52 125 L48 125 Z" fill={color.dark} />
      <path d="M50 125 C44 140 58 152 50 166 C43 178 56 188 50 200" stroke="rgba(236,217,176,0.45)" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

const SHARDS = 10;

/** Ring + flying shards. `delay` lets the opening cluster schedule bursts purely in CSS. */
function Burst({ color, delay = 0 }: { color: Colour; delay?: number }) {
  return (
    <span aria-hidden className="pop-burst" style={{ "--pop": `${delay}ms` } as React.CSSProperties}>
      <span className="pop-ring" style={{ borderColor: color.light }} />
      {Array.from({ length: SHARDS }, (_, i) => (
        <span
          key={i}
          className="pop-shard"
          style={
            {
              "--a": `${(360 / SHARDS) * i + (i % 2 ? 12 : -8)}deg`,
              "--d": `${i % 3 === 0 ? 58 : i % 3 === 1 ? 44 : 34}px`,
              background: i % 4 === 0 ? "#ecd9b0" : i % 2 ? color.base : color.light,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

/* ---------------- Opening cluster: pops in, then bursts to reveal the name ---------------- */

const ENTRY = [
  { x: 9, y: 58, s: 1.0 }, { x: 24, y: 36, s: 0.85 }, { x: 33, y: 66, s: 1.1 }, { x: 46, y: 46, s: 0.95 },
  { x: 58, y: 70, s: 1.0 }, { x: 70, y: 34, s: 0.9 }, { x: 88, y: 56, s: 1.05 }, { x: 15, y: 82, s: 0.9 },
  { x: 50, y: 84, s: 0.85 }, { x: 80, y: 82, s: 1.0 }, { x: 38, y: 24, s: 0.8 }, { x: 62, y: 22, s: 0.8 },
];
// Pop order sweeps outward from the centre so the name is uncovered first.
const POP_ORDER = [3, 4, 10, 11, 1, 5, 2, 8, 0, 6, 7, 9];

function EntryCluster() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {ENTRY.map((b, i) => {
        const color = PALETTE[(i * 5 + 2) % PALETTE.length];
        const inDelay = i * 45;
        const popDelay = 1050 + POP_ORDER.indexOf(i) * 110;
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/3"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: `calc(${b.s} * clamp(62px, 17vw, 128px))` }}
          >
            <div
              className="entry-balloon"
              style={{ "--in": `${inDelay}ms`, "--pop": `${popDelay}ms` } as React.CSSProperties}
            >
              <div className="entry-bob" style={{ animationDelay: `${-i * 0.4}s` }}>
                <BalloonSvg color={color} id={`e${i}`} />
              </div>
            </div>
            <div className="absolute left-1/2 top-[30%]">
              <Burst color={color} delay={popDelay} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Rising balloons: drift up continuously, tap to pop ---------------- */

type BalloonSpec = {
  id: number;
  left: number;
  size: number;
  dur: number;
  delay: number;
  sway: number;
  drift: number;
  depth: "back" | "front";
  color: Colour;
  rest: number;
  extra: boolean;
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
      // The rising flock follows the opening pop.
      delay: i < 10 ? range(rand, 2.2, 3.8) : range(rand, 4, 8),
      sway: range(rand, 2.6, 4.6),
      drift: range(rand, 8, 22),
      depth: front ? "front" : "back",
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
      rest: range(rand, -24, 2),
      extra: i >= 10,
    };
  });
}

const BALLOONS = makeBalloons(16);

type Pop = { key: number; x: number; y: number; color: Colour };

export function Balloons({ layer, withEntry = false }: { layer: "back" | "front"; withEntry?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [popped, setPopped] = useState<Set<number>>(() => new Set());
  const [pops, setPops] = useState<Pop[]>([]);
  const [entryDone, setEntryDone] = useState(false);

  useEffect(() => {
    if (!withEntry) return;
    const t = window.setTimeout(() => setEntryDone(true), ENTRY_POP_DONE + 900);
    return () => window.clearTimeout(t);
  }, [withEntry]);

  const pop = useCallback((b: BalloonSpec, el: HTMLElement) => {
    const host = wrap.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (!host) return;
    const key = Date.now() + b.id;
    setPops((p) => [...p, { key, x: r.left - host.left + r.width / 2, y: r.top - host.top + r.width * 0.55, color: b.color }]);
    setPopped((s) => new Set(s).add(b.id));
    window.setTimeout(() => setPops((p) => p.filter((x) => x.key !== key)), 900);
  }, []);

  const revive = (id: number) =>
    setPopped((s) => {
      if (!s.has(id)) return s;
      const n = new Set(s);
      n.delete(id);
      return n;
    });

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {withEntry && !entryDone && <EntryCluster />}

      {BALLOONS.filter((b) => b.depth === layer).map((b) => (
        <div
          key={b.id}
          className="balloon"
          data-depth={b.depth}
          data-extra={b.extra || undefined}
          onAnimationIteration={(e) => e.target === e.currentTarget && revive(b.id)}
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              "--sway": `${b.sway}s`,
              "--drift": `${b.drift}px`,
              "--rest": `${b.rest}vh`,
              opacity: b.depth === "back" ? 0.5 : 0.95,
            } as React.CSSProperties
          }
        >
          <div className={`balloon-sway ${popped.has(b.id) ? "is-popped" : ""}`}>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              onPointerDown={(e) => !popped.has(b.id) && pop(b, e.currentTarget)}
              className="pointer-events-auto block w-full cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent]"
              style={{ height: b.size * 1.25 }}
            >
              <span className="block" style={{ height: b.size * 2 }}>
                <BalloonSvg color={b.color} id={`r${layer}${b.id}`} />
              </span>
            </button>
          </div>
        </div>
      ))}

      {pops.map((p) => (
        <span key={p.key} className="absolute z-30" style={{ left: p.x, top: p.y }}>
          <Burst color={p.color} />
        </span>
      ))}
    </div>
  );
}
