"use client";

import { motion } from "framer-motion";

type SplitWordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  /** Extra classes for the final word, e.g. an italic accent. */
  lastWordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/** Reveals each word from behind an invisible mask, like a title card. */
export function SplitWords({
  text,
  className,
  wordClassName,
  lastWordClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: SplitWordsProps) {
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "shown" as const }
    : { whileInView: "shown" as const, viewport: { once: true, amount: 0.6 } };

  return (
    <motion.span className={className} initial="hidden" {...trigger} aria-label={text} role="text">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${wordClassName ?? ""} ${i === words.length - 1 ? (lastWordClassName ?? "") : ""}`}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              shown: { y: "0%", opacity: 1 },
            }}
            transition={{ duration: 1.1, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
