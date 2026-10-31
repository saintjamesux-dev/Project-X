import { Reveal } from "@/components/motion/Reveal";

/** "02 — A Man Worth Celebrating" style chapter marker. */
export function ChapterLabel({ index, label, center = false }: { index: number; label: string; center?: boolean }) {
  return (
    <Reveal y={12} className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}>
      <span className="font-display text-lg italic text-champagne/90">{String(index).padStart(2, "0")}</span>
      <span aria-hidden className="h-px w-10 bg-champagne/40" />
      <span className="kicker">{label}</span>
    </Reveal>
  );
}
