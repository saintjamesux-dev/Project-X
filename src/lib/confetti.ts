import confetti from "canvas-confetti";

/** Jewel-toned palette: colourful, but restrained. */
export const CELEBRATION_COLORS = ["#d8b878", "#ecd9b0", "#f4eee3", "#7a2236", "#24386e", "#c98f8f", "#2f5e4e"];
export const GOLD_COLORS = ["#fff3cf", "#ecd9b0", "#d8b878", "#c79a4f"];

const base = {} as const;

type Fire = (options?: confetti.Options) => Promise<null> | null;
let instance: Fire | null = null;

/** One shared, full-screen confetti canvas rendered off the main thread where supported. */
function fire(options: confetti.Options) {
  if (!instance) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "60",
    });
    document.body.appendChild(canvas);
    instance = confetti.create(canvas, { resize: true, useWorker: true, disableForReducedMotion: true });
  }
  return instance(options);
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Twin cannons from the lower corners, then a soft falling shower. */
export function entranceCelebration() {
  const small = window.innerWidth < 640;
  const count = small ? 45 : 120;

  const cannon = (x: number, angle: number) =>
    fire({
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

  cannon(0, 62);
  cannon(1, 118);

  window.setTimeout(() => {
    fire({
      ...base,
      particleCount: small ? 35 : 90,
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

  fire({
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
    fire({
      ...base,
      particleCount: small ? 60 : 160,
      spread: 100,
      startVelocity: small ? 45 : 55,
      origin: { x: origin.x, y: Math.min(origin.y + 0.05, 0.9) },
      colors: CELEBRATION_COLORS,
      ticks: 360,
    });
    fire({ ...base, particleCount: small ? 25 : 70, angle: 60, spread: 60, origin: { x: 0, y: 0.85 }, colors: CELEBRATION_COLORS });
    fire({ ...base, particleCount: small ? 25 : 70, angle: 120, spread: 60, origin: { x: 1, y: 0.85 }, colors: CELEBRATION_COLORS });
  }, 350);

  window.setTimeout(() => {
    fire({
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
