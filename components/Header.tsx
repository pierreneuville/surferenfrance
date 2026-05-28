"use client";

import Link from "next/link";
import { Logo, Wordmark } from "./Logo";
import { StreakBadge } from "./StreakBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-depth-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative overflow-hidden rounded-xl shadow-lg shadow-coral-500/30 transition group-hover:shadow-coral-500/50">
            <Logo size={36} />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span className="flex flex-col leading-none">
            <Wordmark className="text-xl sm:text-2xl" />
            <span className="hidden font-script text-sm leading-none text-sand-200/70 sm:block">
              ta vague est prête
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <StreakBadge />
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <Link href="/#spots" className="transition hover:text-sand-200">Spots</Link>
            <Link href="/#a-propos" className="transition hover:text-sand-200">À propos</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
