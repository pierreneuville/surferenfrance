import Link from "next/link";
import { Waves } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-depth-950/80">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-700">
              <Waves className="h-5 w-5 text-white" />
            </span>
            <div>
              <div className="font-display font-bold">Surf France</div>
              <div className="text-xs text-white/50">
                Données : <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="hover:text-ocean-300">Open-Meteo</a>
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-white/60">
            <Link href="/mentions-legales" className="hover:text-ocean-300">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-ocean-300">Confidentialité</Link>
            <a href="mailto:contact@example.com" className="hover:text-ocean-300">Contact</a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-white/40 text-pretty">
          Les scores sont indicatifs et calculés automatiquement à partir des prévisions. Vérifie toujours
          les conditions sur place avant de te mettre à l'eau. Surfe à ton niveau, respecte les locaux et la nature 🌊
        </p>
      </div>
    </footer>
  );
}
