// Skeleton matched to the /bouees layout so navigation feels instant.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-8">
        <div className="shimmer-wave h-4 w-48 rounded bg-white/[0.05]" />
        <div className="mt-6 shimmer-wave h-3 w-24 rounded bg-white/[0.05]" />
        <div className="mt-3 shimmer-wave h-12 w-3/4 rounded-xl bg-white/[0.05]" />
        <div className="mt-4 shimmer-wave h-4 w-2/3 rounded bg-white/[0.04]" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="shimmer-wave h-20 rounded-2xl border border-white/[0.06] bg-white/[0.025]" />
        ))}
      </div>

      <div className="shimmer-wave h-24 rounded-3xl border border-white/[0.06] bg-white/[0.025]" />

      <div className="mt-5 grid gap-3 lg:hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="shimmer-wave h-44 rounded-3xl border border-white/[0.06] bg-white/[0.025]" />
        ))}
      </div>

      <div className="mt-5 hidden lg:block">
        <div className="shimmer-wave h-96 rounded-3xl border border-white/[0.06] bg-white/[0.025]" />
      </div>
    </div>
  );
}
