/**
 * Favorites system — pure localStorage, no backend.
 *
 * Hook Model angle:
 * - Investment phase: the more spots the user marks ❤️, the more value the app accrues for them.
 * - Loss aversion: once you've curated 5 favorites, you don't want to lose that list to another app.
 * - Trigger: returning users see "your favorites · X with conditions ≥ 70" → reason to come back.
 */

const KEY = "yosurf-favs-v1";
const EVENT = "yosurf:favs-changed";

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setFavorites(slugs: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignored */
  }
}

export function toggleFavorite(slug: string): boolean {
  const current = getFavorites();
  const isFav = current.includes(slug);
  const next = isFav ? current.filter((s) => s !== slug) : [...current, slug];
  setFavorites(next);
  return !isFav;
}

export function subscribeFavorites(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
