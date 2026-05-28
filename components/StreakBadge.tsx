"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { getEngagement, pingVisit, subscribeEngagement } from "@/lib/engagement";

export function StreakBadge() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // ping once on mount
    const s = pingVisit();
    setStreak(s.streak);
    const unsub = subscribeEngagement(() => setStreak(getEngagement().streak));
    return unsub;
  }, []);

  if (streak < 2) return null;

  return (
    <div
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-coral-500/30 bg-coral-500/10 px-2.5 py-1 text-xs font-semibold text-coral-200"
      title={`${streak} jours de suite sur Yosurf`}
    >
      <Flame className="h-3 w-3 fill-coral-400 text-coral-400" />
      {streak}j
    </div>
  );
}
