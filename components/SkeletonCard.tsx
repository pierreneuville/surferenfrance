export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/5" />
        </div>
        <div className="h-12 w-14 rounded-xl bg-white/10" />
      </div>
      <div className="mb-3 h-9 rounded-lg bg-white/5" />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-white/5" />
        ))}
      </div>
      <div className="mt-4 h-8 rounded bg-white/5" />
    </div>
  );
}
