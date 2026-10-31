"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { birthday } from "@/content/birthday";
import { prefersReducedMotion, wishCelebration } from "@/lib/confetti";
import { Cake, type CandlePhase } from "@/components/finale/Cake";
import { ParticleField } from "@/components/motion/ParticleField";
import { SplitWords } from "@/components/motion/SplitWords";
import { ChapterLabel } from "./ChapterLabel";

type Stage = "waiting" | "blowing" | "out" | "celebrated";

const ease = [0.16, 1, 0.3, 1] as const;

export function Finale() {
  const { finale } = birthday;
  const [stage, setStage] = useState<Stage>("waiting");
  const [smokeKey, setSmokeKey] = useState(0);
  const cakeRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const makeWish = useCallback(() => {
    if (stage !== "waiting") return;
    const reduced = prefersReducedMotion();
    setStage("blowing");

    later(() => {
      setStage("out");
      setSmokeKey((k) => k + 1);
      const rect = cakeRef.current?.getBoundingClientRect();
      if (rect) {
        wishCelebration({
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height * 0.22) / window.innerHeight,
        });
      }
    }, reduced ? 200 : 1000);

    later(() => {
      setStage("celebrated");
    }, reduced ? 500 : 2300);

    later(() => {
      messageRef.current?.focus({ preventScroll: true });
      messageRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }, reduced ? 700 : 2900);
  }, [stage]);

  const relight = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage("waiting");
    cakeRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  };

  const candlePhase: CandlePhase = stage === "waiting" ? "lit" : stage === "blowing" ? "blowing" : "out";
  const lit = candlePhase === "lit";

  return (
    <section aria-labelledby="finale-title" className="relative overflow-hidden px-6 pb-24 pt-32 md:px-12 md:pb-32 md:pt-44">
      {/* Dark room, lit only by the candles */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#07070a,#0a0809_40%,#0d0a08)]" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[38%] h-[80vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,190,110,0.22),rgba(200,120,60,0.07)_55%,transparent)] blur-2xl transition-opacity duration-[1600ms]"
        style={{ opacity: lit ? 1 : stage === "celebrated" ? 0.5 : 0.25 }}
      />
      <ParticleField density={34} />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <ChapterLabel index={6} label={finale.kicker} center />

        <div className="mt-10 min-h-[8.5rem] md:min-h-[10rem]">
          <AnimatePresence mode="wait">
            {stage === "waiting" || stage === "blowing" ? (
              <motion.div key="prompt" exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.7, ease }}>
                <h2 id="finale-title" className="font-display text-[clamp(2.3rem,6.6vw,4.6rem)] font-light leading-[1.04] text-ivory">
                  <SplitWords text={finale.headline} lastWordClassName="italic" />
                </h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.7 }}
                  className="mt-5 font-display text-xl italic text-ivory-dim md:text-2xl"
                >
                  {finale.prompt}
                </motion.p>
              </motion.div>
            ) : (
              <motion.p
                key="after"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                className="kicker pt-10"
              >
                {finale.afterWish}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, ease }}
          className="relative mt-6 w-[min(84vw,24rem,50svh)] md:w-[min(27rem,52svh)]"
        >
          <Cake ref={cakeRef} candles={finale.candles} phase={candlePhase} smokeKey={smokeKey} />
          {/* Table reflection */}
          <div aria-hidden className="mx-auto -mt-3 h-6 w-3/4 rounded-[50%] bg-[radial-gradient(closest-side,rgba(216,184,120,0.25),transparent)] blur-md" />
        </motion.div>

        <div className="mt-12 w-full md:mt-14">
          <AnimatePresence mode="wait">
            {stage !== "celebrated" ? (
              <motion.div key="button" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5 }}>
                <motion.button
                  type="button"
                  onClick={makeWish}
                  disabled={stage !== "waiting"}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="wish-button inline-flex min-h-14 items-center gap-3 rounded-full border border-champagne/60 bg-champagne/10 px-9 py-4 font-sans text-sm font-medium tracking-[0.28em] text-champagne-soft uppercase shadow-[0_0_40px_rgba(216,184,120,0.18),inset_0_0_20px_rgba(216,184,120,0.08)] backdrop-blur-sm transition-[background-color,box-shadow,opacity] duration-500 hover:bg-champagne/20 hover:shadow-[0_0_60px_rgba(216,184,120,0.3),inset_0_0_20px_rgba(216,184,120,0.12)] disabled:cursor-default disabled:opacity-60 touch-manipulation"
                >
                  {finale.button}
                  <Sparkles aria-hidden className="h-4 w-4" strokeWidth={1.5} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="message"
                ref={messageRef}
                tabIndex={-1}
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.35 } } }}
                className="mx-auto max-w-2xl outline-none"
              >
                <motion.h2
                  variants={{ hidden: { opacity: 0, y: 24, filter: "blur(10px)" }, shown: { opacity: 1, y: 0, filter: "blur(0px)" } }}
                  transition={{ duration: 1.6, ease }}
                  id="finale-title"
                  className="font-display font-light leading-[0.98] text-ivory"
                >
                  <span className="block text-[clamp(2rem,6vw,3.4rem)] italic text-ivory-dim">{finale.message.title[0]}</span>
                  <span className="text-gold-sheen mt-1 block text-[clamp(2.7rem,11vw,5.6rem)]" style={{ animationDelay: "1s" }}>
                    {finale.message.title[1]}
                  </span>
                </motion.h2>

                <motion.div
                  aria-hidden
                  variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                  transition={{ duration: 1.4, ease }}
                  className="mx-auto my-10 h-px w-28 bg-gradient-to-r from-transparent via-champagne to-transparent"
                />

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } }}
                  transition={{ duration: 1.4, ease }}
                  className="font-display text-[1.45rem] italic leading-[1.55] text-ivory/90 md:text-[1.85rem]"
                >
                  {finale.message.blessing}
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } }}
                  transition={{ duration: 1.4, ease }}
                  className="mt-12"
                >
                  <p className="font-sans text-xs uppercase tracking-[0.26em] text-ivory-dim">{finale.message.closing}</p>
                  <p className="mt-4 font-display text-3xl italic text-champagne-soft md:text-4xl">{finale.message.signature}</p>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
                  transition={{ duration: 1.2, delay: 1.2 }}
                  className="mt-14"
                >
                  <button
                    type="button"
                    onClick={relight}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 font-sans text-xs tracking-[0.18em] text-muted uppercase transition-colors hover:text-champagne-soft touch-manipulation"
                  >
                    <RotateCcw aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {finale.replay}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p aria-live="polite" className="sr-only">
          {stage === "out" ? "The candles have been blown out." : ""}
        </p>
      </div>
    </section>
  );
}
