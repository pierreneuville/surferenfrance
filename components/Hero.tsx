import Image from "next/image";
import { ArrowDown, Waves } from "lucide-react";
import { SPOTS } from "@/lib/spots";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=2400&q=80"
          alt="Vague de surf en France"
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-depth-950/70 via-depth-950/60 to-depth-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/50 via-transparent to-sunset-500/10" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-ocean-200 backdrop-blur">
            <Waves className="h-3.5 w-3.5" />
            {SPOTS.length} spots de l'Atlantique à la Méditerranée
          </span>
          <h1 className="font-display text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            <span className="bg-gradient-to-br from-white via-ocean-100 to-ocean-300 bg-clip-text text-transparent">
              Trouve la vague.
            </span>
            <br />
            <span className="bg-gradient-to-br from-sand-200 via-sand-300 to-sunset-400 bg-clip-text text-transparent">
              Pose-toi sur la planche.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-white/70 md:text-xl">
            Prévisions surf en temps réel pour toute la côte française.
            Score de session par spot, meilleur créneau du jour, vagues, période et vent.
          </p>
          <a
            href="#spots"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ocean-400 to-ocean-600 px-7 py-3 font-medium text-white shadow-lg shadow-ocean-500/40 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-ocean-500/60"
          >
            Voir les spots
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-depth-950" />
    </section>
  );
}
