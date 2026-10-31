import confetti from "canvas-confetti";

/** Jewel-toned palette: colourful, but restrained. */
export const CELEBRATION_COLORS = ["#d8b878", "#ecd9b0", "#f4eee3", "#7a2236", "#24386e", "#c98f8f", "#2f5e4e"];
export const GOLD_COLORS = ["#fff3cf", "#ecd9b0", "#d8b878", "#c79a4f"];

const base = { disableForReducedMotion: true, zIndex: 60 } as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Twin cannons from the lower corners, then a soft falling shower. */
export function entranceCelebration() {
  const small = window.innerWidth < 640;
  const count = small ? 70 : 120;

  const fire = (x: number, angle: number) =>
    confetti({
      ...base,
      particleCount: count,
      angle,
      spread: 58,
      startVelocity: small ? 48 : 62,
      origin: { x, y: 1.02 },
      colors: CELEBRATION_COLORS,
      ticks: 320,
      gravity: 0.9,
      scalar: small ? 0.85 : 1,
    });

  fire(0, 62);
  fire(1, 118);

  window.setTimeout(() => {
    confetti({
      ...base,
      particleCount: small ? 50 : 90,
      spread: 160,
      startVelocity: 18,
      origin: { x: 0.5, y: -0.05 },
      colors: CELEBRATION_COLORS,
      ticks: 420,
      gravity: 0.55,
      drift: 0.2,
      scalar: 0.9,
    });
  }, 900);
}

/** Golden particles rising from the cake, followed by the full celebration. */
export function wishCelebration(origin: { x: number; y: number }) {
  const small = window.innerWidth < 640;

  confetti({
    ...base,
    particleCount: small ? 60 : 100,
    spread: 360,
    startVelocity: 22,
    origin,
    colors: GOLD_COLORS,
    shapes: ["circle"],
    scalar: 0.55,
    gravity: 0.35,
    ticks: 260,
    decay: 0.92,
  });

  window.setTimeout(() => {
    confetti({
      ...base,
      particleCount: small ? 90 : 160,
      spread: 100,
      startVelocity: small ? 45 : 55,
      origin: { x: origin.x, y: Math.min(origin.y + 0.05, 0.9) },
      colors: CELEBRATION_COLORS,
      ticks: 360,
    });
    confetti({ ...base, particleCount: small ? 40 : 70, angle: 60, spread: 60, origin: { x: 0, y: 0.85 }, colors: CELEBRATION_COLORS });
    confetti({ ...base, particleCount: small ? 40 : 70, angle: 120, spread: 60, origin: { x: 1, y: 0.85 }, colors: CELEBRATION_COLORS });
  }, 350);

  window.setTimeout(() => {
    confetti({
      ...base,
      particleCount: small ? 50 : 90,
      spread: 170,
      startVelocity: 14,
      origin: { x: 0.5, y: -0.05 },
      colors: GOLD_COLORS,
      gravity: 0.4,
      ticks: 480,
      scalar: 0.8,
      drift: -0.15,
    });
  }, 1500);
}
