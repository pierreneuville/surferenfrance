import Link from "next/link";
import { Compass, Waves } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      {/* big 404 with surf vibe */}
      <div className="relative">
        <span className="font-display text-[10rem] font-extrabold leading-none text-gradient-sunset opacity-40">
          404
        </span>
        <Waves className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-white/85 drop-shadow-2xl animate-float" />
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
        <span className="text-gradient-ocean">Cette vague</span>{" "}
        <span className="font-script text-4xl text-gradient-sunset sm:text-5xl">
          n'existe pas.
        </span>
      </h1>

      <p className="mt-4 max-w-md text-pretty text-white/65">
        Le spot que tu cherches a peut-être pris le large, ou alors c'est juste un mauvais courant d'URL.
      </p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Link
          href="/"
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-6 py-3 font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <Waves className="h-4 w-4" />
          Retour à la carte des vagues
        </Link>
        <Link
          href="/#spots"
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          <Compass className="h-4 w-4" />
          Explorer les 231 spots
        </Link>
      </div>
    </div>
  );
}
