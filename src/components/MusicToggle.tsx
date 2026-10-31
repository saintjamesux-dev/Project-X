"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2, Pause } from "lucide-react";
import { birthday } from "@/content/birthday";
import { MusicBox } from "@/lib/musicBox";

/** Optional, visitor-initiated birthday melody. Nothing plays until pressed. */
export function MusicToggle() {
  const box = useRef<MusicBox | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => box.current?.pause(), []);

  const toggle = async () => {
    box.current ??= new MusicBox();
    if (playing) {
      box.current.pause();
      setPlaying(false);
    } else {
      await box.current.play();
      setPlaying(true);
    }
  };

  const label = playing ? birthday.music.pause : birthday.music.play;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={label}
      title={label}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 4 }}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-midnight/60 text-ivory-dim backdrop-blur-md transition-colors hover:border-champagne/50 hover:text-champagne-soft md:right-8 touch-manipulation"
    >
      {playing ? <Pause className="h-4 w-4" strokeWidth={1.5} aria-hidden /> : <Music2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
      {playing && (
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-champagne/30 [animation-duration:2.4s]" />
      )}
    </motion.button>
  );
}
