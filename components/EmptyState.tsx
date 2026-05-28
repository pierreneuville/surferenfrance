import { Compass } from "lucide-react";

const PUNCHLINES = [
  "Hmm. La mer est calme par ici.",
  "Aucun spot sous ces critères. Élargis ta recherche.",
  "Personne ne surfe ce coin aujourd'hui.",
  "On dirait que tu cherches une vague invisible.",
];

export function EmptyState({ message }: { message?: string }) {
  const punchline = message ?? PUNCHLINES[Math.floor(Math.random() * PUNCHLINES.length)];
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-ocean-950/40 via-depth-950 to-depth-950 px-6 py-16 text-center">
      {/* decorative wave */}
      <svg
        viewBox="0 0 200 60"
        className="mx-auto mb-6 h-12 w-32 text-ocean-400/60"
        aria-hidden
      >
        <path
          d="M0 30 Q 25 5 50 30 T 100 30 T 150 30 T 200 30"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 45 Q 25 20 50 45 T 100 45 T 150 45 T 200 45"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <p className="font-script text-2xl text-sand-200/90">{punchline}</p>
      <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/45">
        <Compass className="h-3.5 w-3.5" />
        Essaie une autre région, un autre jour, ou désactive le filtre proximité.
      </p>
    </div>
  );
}
