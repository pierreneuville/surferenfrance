import Link from "next/link";
import { Waves } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-depth-950/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-700 shadow-lg shadow-ocean-500/30">
            <Waves className="h-5 w-5 text-white" />
          </span>
          <span className="bg-gradient-to-r from-ocean-300 to-emerald-300 bg-clip-text text-transparent">
            Surf France
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link href="/#spots" className="transition hover:text-ocean-300">Spots</Link>
          <Link href="/#a-propos" className="transition hover:text-ocean-300">À propos</Link>
        </nav>
      </div>
    </header>
  );
}
