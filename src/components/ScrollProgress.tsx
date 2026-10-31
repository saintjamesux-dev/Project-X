"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline of champagne light that fills as the story unfolds. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-champagne/0 via-champagne/80 to-champagne-soft"
    />
  );
}
