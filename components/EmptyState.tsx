import { Search } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] py-16 text-center">
      <Search className="mx-auto mb-3 h-10 w-10 text-white/30" />
      <p className="text-white/60">{message}</p>
    </div>
  );
}
