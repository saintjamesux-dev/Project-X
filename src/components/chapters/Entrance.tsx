"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { birthday } from "@/content/birthday";
import { entranceCelebration } from "@/lib/confetti";
import { Balloons } from "@/components/motion/Balloons";
import { ParticleField } from "@/components/motion/ParticleField";

const ease = [0.16, 1, 0.3, 1] as const;

export function Entrance() {
  const { entrance } = birthday;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const backY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  useEffect(() => {
    const t = window.setTimeout(entranceCelebration, 1500);
    return () => window.clearTimeout(t);
  }, []);

  const letters = entrance.eyebrow.toUpperCase().split("");

  return (
    <section
      ref={ref}
      aria-label="Happy Birthday, Uncle Sebastian"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Atmosphere */}
      <motion.div aria-hidden style={{ y: backY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1a1520_0%,#0b0a0f_45%,#07070a_75%)]" />
        <div className="animate-breathe absolute inset-x-[-20%] top-[-35%] h-[110vh] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(236,217,176,0.14),rgba(216,184,120,0.045)_50%,rgba(216,184,120,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(122,34,54,0.18),transparent)]" />
      </motion.div>

      <Balloons layer="back" />
      <ParticleField density={70} />

      {/* Title */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <h1 className="flex flex-col items-center">
          <span className="sr-only">{`${entrance.eyebrow}, ${entrance.name.join(" ")}`}</span>
          <span aria-hidden className="mb-6 flex font-sans [@media(max-height:500px)]:mb-3 text-[0.72rem] font-medium tracking-[0.55em] text-champagne sm:text-sm md:mb-8">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.05, ease }}
                className="inline-block"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </span>

          <span aria-hidden className="block font-display font-light leading-[0.88] tracking-[-0.01em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.4, delay: 1.0, ease }}
                className="block text-[clamp(2rem,min(11vw,15svh),7.5rem)] italic text-ivory-dim"
              >
                {entrance.name[0]}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.5, delay: 1.2, ease }}
                className="text-gold-sheen block text-[clamp(2.6rem,min(17vw,24svh),12rem)] uppercase tracking-[0.02em]"
              >
                {entrance.name[1]}
              </motion.span>
            </span>
          </span>
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 2.1, ease }}
          className="my-7 h-px w-24 [@media(max-height:500px)]:my-4 bg-gradient-to-r from-transparent via-champagne to-transparent md:my-9 md:w-40"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2.4, ease }}
          className="font-display text-2xl italic text-ivory/90 md:text-4xl [@media(max-height:500px)]:text-xl"
        >
          {entrance.tagline}
        </motion.p>
      </motion.div>

      <Balloons layer="front" />

      {/* Scroll cue */}
      <motion.a
        href="#celebrate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 3.4 }}
        className="group absolute bottom-[max(2rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:hidden left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-4 px-4 text-center"
      >
        <span className="whitespace-nowrap font-sans text-[0.68rem] tracking-[0.08em] text-ivory-dim sm:tracking-[0.18em] transition-colors group-hover:text-champagne-soft sm:text-xs">
          {entrance.scrollCue} <span aria-hidden>↓</span>
        </span>
        <span aria-hidden className="relative h-12 w-px overflow-hidden bg-white/10">
          <span className="animate-cue-line absolute inset-0 bg-champagne" />
        </span>
      </motion.a>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-midnight" />
    </section>
  );
}
