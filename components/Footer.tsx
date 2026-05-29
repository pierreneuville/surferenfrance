import Link from "next/link";
import { Github, Heart } from "lucide-react";
import { Logo, Wordmark } from "./Logo";
import { PremiumTeaser } from "./PremiumTeaser";
import { REGION_EMOJI, REGIONS } from "@/lib/spots";
import { REGION_SLUGS } from "@/lib/seo";

const QUOTES = [
  { text: "La meilleure planche est celle que tu prends.", author: "proverbe surfeur" },
  { text: "Il n'y a pas de mauvaises vagues, juste des mauvais surfeurs.", author: "Laird Hamilton" },
  { text: "Tout ce dont tu as besoin pour surfer, c'est un peu d'eau.", author: "Kelly Slater" },
  { text: "Le surf, c'est un acte de foi en chaque vague.", author: "Tom Curren" },
  { text: "L'océan ne nous appartient pas. On lui rend visite.", author: "—" },
  { text: "Out there in the soup, you find yourself.", author: "Mickey Munoz" },
];

export function Footer() {
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/[0.06] bg-depth-950/80">
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-t from-coral-500/10 via-sunset-500/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Quote of the day */}
        <div className="mx-auto max-w-2xl text-center">
          <svg viewBox="0 0 200 30" className="mx-auto mb-4 h-6 w-32 text-ocean-400/50" aria-hidden>
            <path d="M0 15 Q 25 0 50 15 T 100 15 T 150 15 T 200 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <p className="font-script text-2xl leading-snug text-sand-200 sm:text-3xl">
            « {quote.text} »
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-white/40">
            — {quote.author}
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <Wordmark className="text-lg" />
              <div className="font-script text-sm text-sand-200/70">la carte des vagues</div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <Link href="/#spots" className="transition hover:text-sand-200">Spots</Link>
            <Link href="/spots" className="transition hover:text-sand-200">Index des spots</Link>
            <Link href="/#a-propos" className="transition hover:text-sand-200">À propos</Link>
            <PremiumTeaser
              trigger={
                <span className="cursor-pointer transition hover:text-sand-200">
                  yo<span className="text-gradient-sunset">surf</span>+
                </span>
              }
            />
            <Link href="/mentions-legales" className="transition hover:text-sand-200">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="transition hover:text-sand-200">Confidentialité</Link>
            <a
              href="https://github.com/pierreneuville/surferenfrance"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition hover:text-sand-200"
            >
              <Github className="h-3.5 w-3.5" />
              Code
            </a>
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-white/35">
          Fait avec <Heart className="inline h-3 w-3 fill-coral-400 text-coral-400" /> en France · données{" "}
          <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline hover:text-sand-200">
            Open-Meteo
          </a>
          {" "}· surfe à ton niveau et respecte les locaux 🤙
        </p>

        <nav
          aria-label="Prévisions surf par région"
          className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-white/45"
        >
          {REGIONS.map((region) => (
            <Link
              key={region}
              href={`/region/${REGION_SLUGS[region]}`}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 transition hover:border-ocean-400/40 hover:text-ocean-200"
            >
              {REGION_EMOJI[region]} {region}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
