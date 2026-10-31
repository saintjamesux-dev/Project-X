"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { birthday } from "@/content/birthday";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { ChapterLabel } from "./ChapterLabel";

function Portrait() {
  const { portrait, people } = birthday;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.figure
      style={{ y: frameY }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      className="relative mx-auto w-full max-w-[22rem] md:max-w-none"
    >
      {/* Offset hairline frame */}
      <div aria-hidden className="absolute -inset-2 translate-x-3 translate-y-3 border border-champagne/25 md:-inset-4 md:translate-x-6 md:translate-y-6" />
      <motion.div
        ref={ref}
        variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, shown: { clipPath: "inset(0% 0% 0% 0%)" } }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[3/4] overflow-hidden bg-ink"
      >
        {portrait ? (
          <motion.div style={{ y: imageY }} className="absolute -inset-y-[8%] inset-x-0">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              sizes="(min-width: 768px) 40vw, 88vw"
              className="object-cover object-[50%_30%]"
              priority={false}
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_40%,#1d1820,#0d0c11)]">
            <span className="font-display text-8xl italic text-champagne/70">S</span>
            <span className="kicker text-muted">A photograph belongs here</span>
          </div>
        )}
        {/* Warm grade + vignette to sit the photo inside the palette */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_55%,rgba(7,7,10,0.55))]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
      </motion.div>
      <figcaption className="mt-6 flex items-center justify-between gap-4 text-ivory-dim">
        <span className="font-display text-xl italic">{portrait?.caption ?? people.recipientFullName}</span>
        <span className="kicker text-[0.6rem] text-muted">Celebrating you</span>
      </figcaption>
    </motion.figure>
  );
}

export function Celebrate() {
  const { celebrate } = birthday;
  return (
    <section id="celebrate" aria-labelledby="celebrate-title" className="relative scroll-mt-0 overflow-hidden px-6 py-28 md:px-12 md:py-44">
      <div aria-hidden className="absolute right-[-20%] top-1/4 h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(216,184,120,0.07),transparent)] blur-2xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-24">
        <div className="order-2 md:order-1">
          <Portrait />
        </div>

        <div className="order-1 md:order-2">
          <ChapterLabel index={2} label={celebrate.kicker} />
          <h2 id="celebrate-title" className="mt-10 font-display font-light leading-[1.02] tracking-[-0.01em]">
            <SplitWords text={celebrate.headline[0]} className="block text-[clamp(2.1rem,6vw,4.25rem)] text-ivory-dim/70" />
            <SplitWords
              text={celebrate.headline[1]}
              delay={0.35}
              className="mt-2 block text-[clamp(2.1rem,6vw,4.25rem)] italic text-ivory"
            />
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-10 max-w-xl text-base leading-[1.85] text-ivory-dim md:text-lg">{celebrate.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
