# Yosurf — 15 itérations roadmap

Date : 2026-05-30

Objectif : avancer après la phase bouées en priorisant les quick wins Phase 1 qui améliorent la pertinence surf, la sécurité et l'expérience mobile sans clé API.

## Itérations livrées

| # | Itération | Résultat |
|---|---|---|
| 1 | Lecture roadmap post-phase 3 | Priorité donnée aux quick wins sans dépendance API. |
| 2 | Extension du type `Spot` | Ajout de `worldClass?: true` pour les spots experts. |
| 3 | Extension du type `DaySummary` | Ajout de `effectiveWaveHeight`, `wavePower`, `engagedSurf`. |
| 4 | Puissance de houle | Calcul `0.49 * H² * T` en kW/m. |
| 5 | Sets longues périodes | Amplification de hauteur ressentie au-dessus de 9 s. |
| 6 | Hard cap débutant | Conditions engagées ramenées à 0 pour éviter les recommandations dangereuses. |
| 7 | Cap intermédiaire | Surf engagé limité pour éviter de sur-noter les grosses houles. |
| 8 | Pondération score v2 | Ajout d'un 5e critère puissance dans `computeScore()`. |
| 9 | Catalogue world-class | 24 spots d'élite marqués `worldClass`. |
| 10 | Filtre home par niveau | Les spots world-class ne remontent plus en débutant/intermédiaire. |
| 11 | HotToday local | Si géoloc active, la recommandation chaude reste dans un rayon de 50 km. |
| 12 | WeekHighlights local | Si géoloc active, les sessions de la semaine restent dans un rayon de 120 km. |
| 13 | Cards enrichies | Affichage sets estimés, puissance et badges `surf engagé` / `expert only`. |
| 14 | Fiche spot enrichie | Ajout d'une tuile puissance dans le détail et le modal. |
| 15 | Roadmap synchronisée | Statuts Phase 1 et Phase 3 mis à jour. |

## Reste à faire

- Phase 1.1 : renommer "Côte d'Argent" en "Aquitaine".
- Phase 1.5 : déclencher un prompt géoloc non bloquant après scroll et ajouter fallback IP Vercel.
- Phase 1.6 : DOM-TOM.
