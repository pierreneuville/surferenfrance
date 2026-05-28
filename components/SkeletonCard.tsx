export function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">
      {/* Top gradient strip placeholder */}
      <div className="h-1 bg-gradient-to-r from-ocean-500/40 via-coral-500/40 to-sand-400/40 shimmer-wave" />
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/10 shimmer-wave" />
            <div className="h-5 w-40 rounded-full bg-white/15 shimmer-wave" />
            <div className="h-2 w-20 rounded-full bg-white/5 shimmer-wave" />
          </div>
          {/* Circular gauge skeleton */}
          <div className="relative h-16 w-16 rounded-full border-2 border-white/10 shimmer-wave" />
        </div>
        {/* Best window skeleton */}
        <div className="mb-4 h-14 rounded-2xl border border-white/[0.06] bg-white/[0.03] shimmer-wave" />
        {/* Stats triplet */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.03] shimmer-wave" />
          ))}
        </div>
        {/* 7-day mini bars */}
        <div className="grid grid-cols-7 gap-1 border-t border-white/[0.05] pt-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 rounded bg-white/[0.04] shimmer-wave" />
          ))}
        </div>
      </div>
    </div>
  );
}
