"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo, Wordmark } from "./Logo";
import { StreakBadge } from "./StreakBadge";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on Esc and lock body scroll while open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-depth-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="relative shrink-0 overflow-hidden rounded-xl shadow-lg shadow-coral-500/30 transition group-hover:shadow-coral-500/50">
            <Logo size={36} />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <Wordmark className="text-xl sm:text-2xl" />
            <span className="hidden font-script text-sm leading-none text-sand-200/70 sm:block">
              ta vague est prête
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <StreakBadge />
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <Link href="/#spots" className="transition hover:text-sand-200">Spots</Link>
            <Link href="/#a-propos" className="transition hover:text-sand-200">À propos</Link>
          </nav>
          {/* Mobile: quick Spots link + burger */}
          <Link
            href="/#spots"
            className="tap-target inline-flex items-center rounded-full bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85 transition hover:bg-white/10 md:hidden"
          >
            Spots
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="tap-target grid h-9 w-9 place-items-center rounded-full bg-white/5 transition hover:bg-white/10 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer — solid bg + max z-index so no content bleeds through */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          {/* Solid opaque background — guarantee no content bleed regardless of backdrop-blur support */}
          <div className="absolute inset-0 bg-depth-950" aria-hidden />
          {/* Subtle ambient glow on top of solid bg */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.18),transparent_60%)]" aria-hidden />

          <div className="relative flex h-full flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Logo size={32} />
                <Wordmark className="text-lg" />
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="tap-target grid h-9 w-9 place-items-center rounded-full bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-4 text-base">
              <MobileLink href="/#spots" onClick={() => setMenuOpen(false)}>🏄 Tous les spots</MobileLink>
              <MobileLink href="/#a-propos" onClick={() => setMenuOpen(false)}>ℹ️ À propos du score</MobileLink>
              <MobileLink href="/mentions-legales" onClick={() => setMenuOpen(false)}>Mentions légales</MobileLink>
              <MobileLink href="/politique-confidentialite" onClick={() => setMenuOpen(false)}>Confidentialité</MobileLink>
            </nav>
            <p className="px-4 pb-6 text-center font-script text-sm text-sand-200/70">
              yo, ta vague est prête.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="tap-target flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-white/85 transition hover:bg-white/[0.05]"
    >
      <span>{children}</span>
      <span className="text-white/40">→</span>
    </Link>
  );
}
