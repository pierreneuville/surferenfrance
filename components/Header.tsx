"use client";

import Link from "next/link";
import { Waves } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-depth-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-coral-500 via-sunset-500 to-sand-400 shadow-lg shadow-coral-500/30 transition group-hover:shadow-coral-500/50">
            <Waves className="h-5 w-5 text-white drop-shadow" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
              surferenfrance
            </span>
            <span className="hidden font-script text-sm leading-none text-sand-200/70 sm:block">
              la carte des vagues
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link href="/#spots" className="transition hover:text-sand-200">Spots</Link>
          <Link href="/#a-propos" className="transition hover:text-sand-200">À propos</Link>
        </nav>
      </div>
    </header>
  );
}
