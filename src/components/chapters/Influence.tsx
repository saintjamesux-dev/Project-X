"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { birthday } from "@/content/birthday";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterLabel } from "./ChapterLabel";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** One statement that brightens as it reaches the centre of the screen, then recedes. */
function Statement({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0.12, 1, 1, 0.12]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -60]);
  const lineScale = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);

  return (
    <li ref={ref} className="flex min-h-[62svh] items-center md:min-h-[70svh]">
      <motion.div style={{ opacity, y }} className="w-full will-change-transform">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-display text-base italic text-champagne">{ROMAN[index]}</span>
          <motion.span aria-hidden style={{ scaleX: lineScale }} className="h-px w-16 origin-left bg-champagne/50" />
        </div>
        <p className="font-display text-[clamp(2rem,6.4vw,4.75rem)] font-light leading-[1.08] tracking-[-0.01em] text-ivory">
          {text}
        </p>
      </motion.div>
    </li>
  );
}

export function Influence() {
  const { influence } = birthday;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} aria-labelledby="influence-title" className="relative px-6 pt-24 md:px-12 md:pt-32">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#07070a,#0b0a10_30%,#0b0a10_70%,#07070a)]" />

      {/* Thread of progress along the left edge */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-6 top-0 hidden md:left-12 md:block">
        <div className="sticky top-0 flex h-svh items-center">
          <div className="relative h-[40vh] w-px bg-white/10">
            <motion.div style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-champagne/70" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl md:pl-16">
        <ChapterLabel index={3} label={influence.kicker} />
        <Reveal delay={0.15}>
          <h2 id="influence-title" className="mt-8 font-display text-2xl italic text-ivory-dim md:text-3xl">
            {influence.intro}
          </h2>
        </Reveal>
        <ol className="mt-6">
          {influence.statements.map((s, i) => (
            <Statement key={s} text={s} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
