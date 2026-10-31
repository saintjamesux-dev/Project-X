"use client";

import { MotionConfig } from "framer-motion";
import { Entrance } from "@/components/chapters/Entrance";
import { Celebrate } from "@/components/chapters/Celebrate";
import { Influence } from "@/components/chapters/Influence";
import { PersonalNote } from "@/components/chapters/PersonalNote";
import { Wishes } from "@/components/chapters/Wishes";
import { Finale } from "@/components/chapters/Finale";
import { ScrollProgress } from "@/components/ScrollProgress";
import { MusicToggle } from "@/components/MusicToggle";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <main>
        <Entrance />
        <Celebrate />
        <Influence />
        <PersonalNote />
        <Wishes />
        <Finale />
      </main>
      <Footer />
      <MusicToggle />
    </MotionConfig>
  );
}
