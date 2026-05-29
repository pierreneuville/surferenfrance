"use client";

import { useState } from "react";
import { Bell, BellRing, Calendar, Sparkles, Waves, X } from "lucide-react";
import { EmailCapture } from "./EmailCapture";

/**
 * Yosurf+ teaser — apparait via lien dans le footer ou auprès du modal "À propos".
 * Capture des leads premium pour quand on lancera le service payant.
 *
 * Modèle envisagé:
 *  - 2,99€/mois ou 24€/an
 *  - Alertes push "houle d'exception J-2"
 *  - Prévisions 15 jours (vs 7j gratuit)
 *  - Marées détaillées
 *  - Pas de pub
 */
export function PremiumTeaser({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="contents">{trigger}</button>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-gradient-to-br from-coral-500/15 via-depth-950 to-depth-950 p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/20 sm:hidden" />

            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-coral-500 via-sunset-500 to-sand-400 shadow-lg shadow-coral-500/30">
                <Sparkles className="h-5 w-5 text-white" />
              </span>
              <div>
                <div className="font-display text-2xl font-extrabold leading-none">
                  yo<span className="text-gradient-sunset">surf</span>+
                </div>
                <div className="text-[10px] uppercase tracking-widest text-sand-200/80">bientôt disponible</div>
              </div>
            </div>

            <h2 className="mt-5 font-display text-3xl font-bold leading-tight">
              <span className="text-gradient-ocean">Ne rate plus</span>{" "}
              <span className="font-script text-4xl text-gradient-sunset">une houle.</span>
            </h2>

            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <Feature icon={<BellRing className="h-4 w-4" />} title="Alertes push" sub="« Houle d'exception J-2 à Hossegor »" />
              <Feature icon={<Calendar className="h-4 w-4" />} title="Prévisions 15 jours" sub="vs 7 jours gratuits" />
              <Feature icon={<Waves className="h-4 w-4" />} title="Marées détaillées" sub="Heure pleine mer / basse mer par spot" />
              <Feature icon={<Bell className="h-4 w-4" />} title="Pas de pub" sub="Expérience pure" />
            </ul>

            <div className="mt-6 mb-2 text-xs uppercase tracking-widest text-sand-200/70">
              Précommande la beta (gratuit, sans engagement)
            </div>
            <EmailCapture
              intent="premium-waitlist"
              title="Sois prévenu au lancement"
              description="Tu seras dans les premiers à essayer Yosurf+, avec une réduction lifetime de -50% sur l'abonnement."
              ctaLabel="Me prévenir"
              className="bg-transparent border-coral-400/20"
            />
          </div>
        </div>
      )}
    </>
  );
}

function Feature({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.03] p-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-sunset-500 text-white">
        {icon}
      </span>
      <div>
        <div className="font-display text-sm font-bold">{title}</div>
        <div className="text-[11px] text-white/55">{sub}</div>
      </div>
    </li>
  );
}
