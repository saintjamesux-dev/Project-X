"use client";

import { useEffect, useRef } from "react";

type ParticleFieldProps = {
  density?: number;
  className?: string;
  /** Particles drift upward (embers) or hang in the air (dust). */
  rise?: boolean;
};

type Particle = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number; phase: number };

/**
 * Lightweight canvas of drifting golden motes. Pauses when off-screen or when
 * the tab is hidden, and draws a single still frame for reduced-motion users.
 */
export function ParticleField({ density = 60, className = "", rise = true }: ParticleFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;

    const spawn = (anywhere: boolean): Particle => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: rise ? -(Math.random() * 0.25 + 0.05) : (Math.random() - 0.5) * 0.06,
      a: Math.random() * 0.5 + 0.2,
      tw: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(density * Math.min(1, (width * height) / (1280 * 800)) + density * 0.25);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.phase += p.tw;
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.phase));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255, 236, 196, ${alpha})`);
        g.addColorStop(0.4, `rgba(216, 184, 120, ${alpha * 0.45})`);
        g.addColorStop(1, "rgba(216, 184, 120, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.phase * 0.5) * 0.08;
        p.y += p.vy;
        if (p.y < -10 || p.x < -10 || p.x > width + 10 || (!rise && p.y > height + 10)) {
          particles[i] = spawn(!rise);
        }
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduced) draw();
      else if (visible && !document.hidden) frame = requestAnimationFrame(step);
    };

    resize();
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? cancelAnimationFrame(frame) : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, rise]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
