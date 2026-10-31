import { birthday } from "@/content/birthday";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] px-16 py-10 text-center">
      <p className="font-display text-lg italic text-ivory-dim">{birthday.site.title}</p>
      <p className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.28em] text-muted">
        Made with love by {birthday.people.sender}
      </p>
    </footer>
  );
}
