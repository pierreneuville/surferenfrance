/**
 * Engagement tracking — daily streak + spots explored.
 *
 * Psychology:
 * - Streak = habit formation (Fogg's Tiny Habits, Duolingo's signature mechanic)
 *   We keep it MUTED (no big aggressive badge until ≥ 2 days, no shame for breaking it)
 * - Explored count = endowed progress effect (Nunes & Drèze)
 *   Surfeurs aiment voir "j'ai exploré 14/258" → they feel committed to the journey
 * - Milestone toasts = dopamine peaks (peak-end rule, Kahneman)
 */

const KEY = "yosurf-engagement-v1";
const EVENT = "yosurf:engagement-changed";
const MILESTONE_EVENT = "yosurf:milestone";

const EXPLORED_MILESTONES = [5, 10, 25, 50, 100, 200];
const STREAK_MILESTONES = [3, 7, 14, 30];

export interface EngagementState {
  streak: number;
  lastVisitISO: string;
  exploredSlugs: string[];
}

export type MilestoneKind = "explored" | "streak";
export interface Milestone {
  kind: MilestoneKind;
  value: number;
  message: string;
}

function load(): EngagementState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { streak: 0, lastVisitISO: "", exploredSlugs: [] };
  } catch {
    return { streak: 0, lastVisitISO: "", exploredSlugs: [] };
  }
}

function save(state: EngagementState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch { /* ignored */ }
}

function dispatchMilestone(m: Milestone) {
  try {
    window.dispatchEvent(new CustomEvent<Milestone>(MILESTONE_EVENT, { detail: m }));
  } catch { /* ignored */ }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Call once per session/visit. Updates streak. Returns the new state. */
export function pingVisit(): EngagementState {
  const state = load();
  const today = todayISO();
  if (state.lastVisitISO === today) return state;

  const prevStreak = state.streak;
  if (state.lastVisitISO) {
    const last = new Date(state.lastVisitISO + "T00:00:00").getTime();
    const now = new Date(today + "T00:00:00").getTime();
    const diffDays = Math.round((now - last) / 86_400_000);
    state.streak = diffDays === 1 ? state.streak + 1 : 1;
  } else {
    state.streak = 1;
  }
  state.lastVisitISO = today;
  save(state);

  // Streak milestone?
  if (state.streak > prevStreak && STREAK_MILESTONES.includes(state.streak)) {
    dispatchMilestone({
      kind: "streak",
      value: state.streak,
      message:
        state.streak === 3 ? "3 jours d'affilée 🔥 t'es accroché !"
        : state.streak === 7 ? "1 semaine sur Yosurf — t'es local 🤙"
        : state.streak === 14 ? "2 semaines de suite, surfeur·euse infatigable 🌊"
        : `${state.streak} jours d'affilée — tu surfes ou tu vibes ? 🏄`,
    });
  }
  return state;
}

export function recordExploredSpot(slug: string): EngagementState {
  const state = load();
  if (!state.exploredSlugs.includes(slug)) {
    state.exploredSlugs.push(slug);
    save(state);
    if (EXPLORED_MILESTONES.includes(state.exploredSlugs.length)) {
      const n = state.exploredSlugs.length;
      dispatchMilestone({
        kind: "explored",
        value: n,
        message:
          n === 5 ? "5 spots explorés 🌊 t'as commencé l'aventure"
          : n === 10 ? "10 spots ! tu connais déjà la côte 🤙"
          : n === 25 ? "25 spots — tu deviens dangereux"
          : n === 50 ? "50 spots ! surf explorer mode ON 🔥"
          : n === 100 ? "100 spots !! tu surfes ou tu fais une thèse ?"
          : `${n} spots explorés — t'es chez toi sur Yosurf`,
      });
    }
  }
  return state;
}

export function getEngagement(): EngagementState {
  return load();
}

export function subscribeEngagement(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

export function subscribeMilestone(cb: (m: Milestone) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<Milestone>).detail);
  window.addEventListener(MILESTONE_EVENT, handler);
  return () => window.removeEventListener(MILESTONE_EVENT, handler);
}
