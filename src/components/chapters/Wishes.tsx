"use client";

import { motion } from "framer-motion";
import { birthday } from "@/content/birthday";
import { seeded, range } from "@/lib/random";
import { SplitWords } from "@/components/motion/SplitWords";
import { ChapterLabel } from "./ChapterLabel";

const rand = seeded(2024);
const STARS = Array.from({ length: 46 }, () => ({
  left: range(rand, 0, 100),
  top: range(rand, 0, 100),
  size: range(rand, 1, 2.4),
  dur: range(rand, 2.5, 6),
  delay: range(rand, 0, 5),
}));

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden>
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0 Z" fill="currentColor" />
    </svg>
  );
}

export function Wishes() {
  const { wishes } = birthday;

  return (
    <section aria-labelledby="wishes-title" className="relative overflow-hidden px-6 py-32 md:px-12 md:py-48">
      {/* Night sky with slow rays of light */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,#13121c,#07070a_70%)]" />
      <div aria-hidden className="absolute left-1/2 top-[-30vmax] h-[100vmax] w-[100vmax] -translate-x-1/2 opacity-60">
        <div className="animate-slow-spin h-full w-full rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(236,217,176,0.05)_0deg_4deg,transparent_4deg_18deg)] [mask-image:radial-gradient(closest-side,black,transparent)]" />
      </div>
      <div aria-hidden className="absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-champagne-soft"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <ChapterLabel index={5} label={wishes.kicker} center />
        <h2
          id="wishes-title"
          className="mx-auto mt-10 max-w-3xl font-display text-[clamp(2.4rem,7vw,5.2rem)] font-light leading-[1.02] text-ivory"
        >
          <SplitWords text={wishes.headline} lastWordClassName="italic text-champagne-soft" />
        </h2>

        <ul className="mx-auto mt-20 max-w-2xl text-left md:mt-28">
          {wishes.items.map((wish, i) => (
            <motion.li
              key={wish}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.8 }}
              className="relative border-t border-white/[0.07] py-7 last:border-b md:py-9"
            >
              <motion.span
                aria-hidden
                variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-px left-0 h-px w-full origin-left bg-gradient-to-r from-champagne/60 via-champagne/20 to-transparent"
              />
              <motion.div
                variants={{ hidden: { opacity: 0, x: -16 }, shown: { opacity: 1, x: 0 } }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline gap-5 md:gap-8"
              >
                <span className="w-6 shrink-0 font-display text-sm italic text-champagne/80 md:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative font-display text-[1.45rem] leading-snug text-ivory/95 md:text-[2rem]">
                  {wish}
                  {/* A single pass of golden light across each wish */}
                  <motion.span
                    aria-hidden
                    variants={{ hidden: { x: "-100%", opacity: 0 }, shown: { x: "120%", opacity: [0, 1, 0] } }}
                    transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-champagne-soft/25 to-transparent mix-blend-screen blur-md"
                  />
                </span>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="mt-20 flex justify-center"
        >
          <Sparkle />
        </motion.div>
      </div>
    </section>
  );
}
