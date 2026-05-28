"use client";

import { useEffect, useState } from "react";
import { Award, X } from "lucide-react";
import type { Milestone } from "@/lib/engagement";
import { subscribeMilestone } from "@/lib/engagement";

/** Dopamine peak — appears briefly when user hits a milestone (5/10/25... spots, 3/7/14j streak) */
export function MilestoneToast() {
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const unsub = subscribeMilestone((m) => {
      setMilestone(m);
      const t = setTimeout(() => setMilestone(null), 5500);
      return () => clearTimeout(t);
    });
    return unsub;
  }, []);

  if (!milestone) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4 sm:top-24">
      <div
        role="status"
        className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent px-4 py-3 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl animate-[float_3s_ease-in-out]"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/40">
          <Award className="h-5 w-5 text-white" />
        </span>
        <div className="flex-1">
          <div className="font-display text-sm font-bold text-emerald-100">
            {milestone.kind === "explored" ? "Nouveau palier !" : "Streak en feu !"}
          </div>
          <div className="text-xs text-white/85">{milestone.message}</div>
        </div>
        <button
          onClick={() => setMilestone(null)}
          className="grid h-6 w-6 place-items-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
          aria-label="Fermer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
