# Yosurf — 30 itérations Phase 3 (UX surfer-first)

User feedback: « ça fait pas sens d'avoir les bouées avant les spots ».
Réponse : remettre la hiérarchie spot-first, traiter les bouées comme donnée de confirmation,
puis polish microcopy / mobile / a11y.

## Bloc A — Reorder & hierarchy (iter 1-8)

### Iter 1 — BuoyMiniPanel sorti du top
- Retiré entre QuickActions et Filters
- Replacé en bas de la home, APRÈS la grille de spots
- Apparait uniquement quand `!loading && visible.length > 0` (pas de bruit au chargement)

### Iter 2 — Section "Mes spots"
- Nouveau composant `MySpots.tsx` : horizontal scroll des favoris triés par score
- Affiché EN PREMIER quand l'utilisateur a des favoris → contexte personnel avant discovery
- Translations FR/EN/ES/PT ajoutées

### Iter 3 — HotToday "ça envoie maintenant"
- Métrique d'actionnabilité = score + bonus contextuel temps
- Day 0 + heure courante DANS la fenêtre → "ÇA ENVOIE MAINTENANT · jusqu'à 17h"
- Day 0 + fenêtre dans ≤ 3h → "ÇA DÉMARRE BIENTÔT · à l'eau dans 2h"
- Sinon : fallback comportement actuel

### Iter 4 — Spot modal : flow surfer
- ✅ Best window AVANT les quick stats tiles
- Reading order : score (hero) → quand y aller → ce qui t'attend → hourly drill-down

### Iter 5 — Spot page aside
- AffiliatePanel en haut (logistique post-décision)
- BuoyMiniPanel devient `<details>` accordion fermé par défaut (donnée de confirmation)

### Iter 6 — SpotCard : hiérarchie claire
- Badges réordonnés par impact décisionnel : `pour confirmés` → `costaud` → tide → puissance
- Puissance affichée seulement quand ≥ 5 kW/m (signal, pas bruit)

### Iter 7 — Geo silencieux + prompt explicite
- IP fallback toujours silencieux
- Tap "Près de moi" upgrade vers browser geo (précise)
- `alert()` remplacé par toast inline (4.5s, non bloquant)
- Nouvelle state `geoPrecise` pour ne pas redemander

### Iter 8 — Default sort = score boosté par distance
- Quand `userPos` présent, le tri score applique un bonus de proximité (+20/-10) :
  spots < 30 km +20, 30-100 km +10, 100-300 km 0, > 300 km -10
- Un 65 à 20 km bat un 80 à 800 km. Mental model surfer respecté.

## Bloc B — Buoys as confirmation (iter 9-13)

### Iter 9 — Accordion fermé par défaut partout
- Spot modal : nouveau `<details>` "Bouée la plus proche" en bas du body
- Spot page : idem (déjà fait iter 5)
- BuoyMiniPanel supporte `title=""` (caller fournit son propre heading)

### Iter 10 — Delta forecast vs live
- BuoyMiniPanel reçoit `forecastWaveHeight` optionnel
- Affiche "✓ ça tient" si écart < 0.2m, sinon "+0.4m vs prévision" ou "-0.3m vs prévision"
- Vert quand ça tient, sand quand divergence

### Iter 11 — "Bouées" hors nav principale
- Retiré de la nav desktop (gardée dans le menu mobile + footer)
- Cible expert seulement

### Iter 12 — Recherche "pour quel spot ?" sur /bouees
- Input autocomplete → pick spot → tri buoy par distance à ce spot
- Bouton X pour retirer le filtre
- Mental model : "trouve la bouée pour MON spot" pas "comprends ma géo"

### Iter 13 — "Mesure live" vs ID brut
- "NOAA 62107" → "Mesure live · 62107" (l'ID reste pour les experts)
- Mobile card : "Atlantique · Mesure live" (zone + nature, pas matricule)

## Bloc C — Microcopy ton surfer (iter 14-19)

### Iter 14 — Score labels surfer
- "Excellent/Bien/Moyen/Faible/Plat" → "Magique/Joue-la/Possible/Mou/Plat"
- Plus actionnable, plus identifiable au verbe d'action

### Iter 15 — Best window verbe d'action
- "Meilleur créneau du jour" → "Vas-y à ces heures" (FR)
- "Go out at these hours" (EN), "Sal al agua a estas horas" (ES), "Vai à água a estas horas" (PT)

### Iter 16 — Tide microcopy avec flèches
- `tideStateLabel` : "marée montante" → "marée monte ↑"
- `tideOptimalLabel` : "mi-marée montante" → "mi-marée montante ↗"
- SpotCard badge : "marée haute 14h32" → "marée monte ↑ jusqu'à 14h32"

### Iter 17 — Surf engagé / Expert only
- "surf engagé" → "costaud"
- "expert only" → "pour confirmés"
- Appliqué sur cards, modal, SpotDetailClient

### Iter 18 — Onboarding chaleureux
- "bienvenue !" → "yo, bienvenue 🤙"
- "Quels spots tu surfes ?" → "Tes spots, à portée de main."
- "Ajouter X favoris" → "C'est parti, je garde X spots"
- Tone moins corporate, plus surfeur

### Iter 19 — Empty states friendlier
- "Aucun spot sous ces critères" → "Ça plate par ici"
- "Personne ne surfe ce coin" → "Personne n'envoie aujourd'hui"
- Suggestions : phrases complètes plutôt que verbes infinitifs

## Bloc D — Mobile / interactions (iter 20-24)

### Iter 20 — Day picker sticky dans modal
- Day picker DÉPLACÉ dans le scrollable body avec `position: sticky`
- Reste visible au top quand on scroll best-window → tiles → hourly → tide → buoy
- Backdrop-blur pour lisibilité au-dessus du contenu

### Iter 21 — Swipe horizontal day navigation
- Existant amélioré : require horizontal dominance 1.5× sur la vertical
- N'hijacke plus les scrolls verticaux dans le modal

### Iter 22 — Favorite : affordance plus marquée
- Cœur 9w/h → 10w/h, ring coral quand activé
- Anim `heart-pop` 250ms ease-out à l'ajout
- Background ring `coral-400/50` quand favorite

### Iter 23 — Tide tile sur SpotCard
- Déjà couvert iter 16 (badge tide refactoré)

### Iter 24 — Score gauge anim au mount
- Nouveau keyframe `score-rise` 700ms cubic-bezier
- Animation depuis dashoffset complet → final, donne l'impression que la jauge "se remplit"
- Custom props CSS pour passer les valeurs depuis JSX

## Bloc E — Polish & ship (iter 25-30)

### Iter 25 — Skeletons cohérents
- Unification borders `border-white/[0.06]` sur les skeletons SpotDetailClient

### Iter 26 — A11y aria-labels
- MySpots cards : `aria-label="Voir {nom}, score {n} sur 100"`
- (Audit étendu : Filters / SpotCard déjà OK)

### Iter 27 — Bottom sticky bar mobile
- Nouveau `MobileBottomBar.tsx` : Filtres · Favoris · Près de moi
- Visible md:hidden, respect safe-area-inset-bottom
- Communication via custom event `yosurf:open-filters` pour découpler le FilterSheet state
- Spacer `h-16 md:hidden` pour que le contenu puisse scroller au-delà

### Iter 28 — PWA install : trigger engagement
- Déclencheur ajouté : 3 spots distincts explorés (OR avec le 30s timer)
- Convertit mieux que pure time-based — catch le "moment of intent"
- Une fois dismissé, plus jamais

### Iter 29 — Build green
- tsc --noEmit pass
- next build clean, 416 spot pages SSG, 102 KB shared JS (inchangé malgré +UX)

### Iter 30 — Changelog + commit (ce fichier)

## Impact

**Avant** : "Bouées live à surveiller" prenait le premier scroll de la home, puis venait HotToday, puis les spots. Le surfeur voyait des données techniques avant les spots qu'il cherchait.

**Après** : la home suit le mental model surfer
1. Mes favoris (si présents) — contexte perso
2. "Ça envoie maintenant" (HotToday + actionnabilité temporelle)
3. "Cette semaine" (WeekHighlights)
4. Filtres
5. **Grille de spots** ← le cœur de l'app
6. Bouées (référence, confirmation)

Microcopy surfer-first partout : "Vas-y à ces heures" plutôt que "Meilleur créneau",
"Magique" plutôt que "Excellent", "marée monte ↑ jusqu'à 14h32" plutôt que "marée haute".

Mobile : bottom bar persistante, swipes entre jours, sticky day picker, anim cœur,
gauge animée, PWA install au bon moment.
