"use client";

import { motion } from "framer-motion";
import { birthday } from "@/content/birthday";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { ParticleField } from "@/components/motion/ParticleField";
import { ChapterLabel } from "./ChapterLabel";

export function PersonalNote() {
  const { note } = birthday;

  return (
    <section aria-labelledby="note-title" className="grain relative overflow-hidden px-6 py-32 md:px-12 md:py-48">
      {/* Warm, candle-lit room */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#07070a_0%,#170d0a_14%,#21130d_50%,#170d0a_86%,#07070a_100%)]" />
      <div aria-hidden className="animate-breathe absolute left-1/2 top-[18%] h-[70vh] w-[110vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,170,96,0.16),rgba(150,70,40,0.06)_60%,transparent)] md:w-[70vw]" />
      <ParticleField density={26} className="opacity-70" />

      <div className="relative mx-auto max-w-2xl">
        <ChapterLabel index={4} label={note.kicker} center />

        <h2 id="note-title" className="mt-10 text-center font-display text-[clamp(2.1rem,6vw,3.9rem)] font-light italic leading-[1.1] text-ivory">
          <SplitWords text={note.headline} stagger={0.05} />
        </h2>

        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-12 h-px w-28 bg-gradient-to-r from-transparent via-champagne/70 to-transparent"
        />

        <article className="mt-14 md:mt-20">
          <Reveal>
            <p className="font-display text-3xl italic text-champagne-soft md:text-4xl">{note.salutation}</p>
          </Reveal>

          <div className="mt-8 space-y-7 md:space-y-8">
            {note.paragraphs.map((p, i) => (
              <Reveal key={i} amount={0.5} y={20}>
                <p
                  className={`font-display text-[1.32rem] leading-[1.7] text-ivory/90 md:text-[1.6rem] md:leading-[1.65] ${
                    i === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-champagne md:first-letter:text-[5rem]"
                      : ""
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 text-right">
            <p className="font-sans text-xs tracking-[0.24em] text-ivory-dim uppercase">{note.closing}</p>
            <p className="mt-3 font-display text-5xl italic text-champagne-soft md:text-6xl">{note.signature}</p>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
