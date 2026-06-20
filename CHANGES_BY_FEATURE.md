# Fichiers modifiés par Feature

## 🎨 Feature: **Core / Directives 3D**
Centralisation de la logique 3D dans une directive réutilisable.

- **NEW** [home25/src/app/core/directives/card-3d.directive.ts](home25/src/app/core/directives/card-3d.directive.ts)
  - Directive `appCard3d` pour l'effet de rotation 3D au survol

---

## 🌤️ Feature: **Weather**
Refactorisation du composant météo pour utiliser la directive 3D.

- [home25/src/app/features/weather/weather.component.ts](home25/src/app/features/weather/weather.component.ts)
  - Suppression de toute la logique 3D (déplacée dans la directive)
  - Simplification drastique (de 100+ lignes → 19 lignes)
  - Import de `Card3dDirective`

- [home25/src/app/features/weather/weather.component.html](home25/src/app/features/weather/weather.component.html)
  - Remplacement de `class="card"` + `(mouseenter/leave)` par `appCard3d`

- [home25/src/app/features/weather/weather.component.scss](home25/src/app/features/weather/weather.component.scss)
  - Suppression des styles 3D (perspective, transform-style, transition)
  - Suppression de box-shadow

---

## 📱 Feature: **Layout / Main**
Ajout du widget d'heure et restructuration du layout avec zones.

- [home25/src/app/layout/main/main.component.ts](home25/src/app/layout/main/main.component.ts)
  - Implémentation `OnInit` + `OnDestroy`
  - Ajout logique d'horloge avec refresh toutes les 1s
  - Formatage date/heure/jour en français avec `Intl.DateTimeFormat`
  - Import de `Card3dDirective`

- [home25/src/app/layout/main/main.component.html](home25/src/app/layout/main/main.component.html)
  - Remplacement structure `.panel-*` par `.time-zone` / `.weather-zone` / `.forest-zone`
  - Ajout `.time-widget` avec appCard3d
  - Ajout attributs `aria-label` pour accessibilité
  - Changement de `<div>` → `<section>` sémantiquement correct

- [home25/src/app/layout/main/main.component.scss](home25/src/app/layout/main/main.component.scss)
  - Refonte complète du layout en CSS Grid avec `grid-template-areas`
  - Ajout zones : `time`, `weather`, `forest`
  - Styles du `.time-widget` (affichage heure/date/jour)
  - Styles du `.forest-zone` (image background avec gradients)
  - Responsive design refondu pour tablette/mobile

---

## 🌍 Feature: **Global Styles**
Variables CSS centralisées et styles réutilisables.

- [home25/src/styles.scss](home25/src/styles.scss)
  - Ajout variables `--ui-bg-*` pour gradients background
  - Ajout variables `--ui-forest-*` pour effet forêt
  - Extraction de `.card-3d` commun (utilisé par Weather + Time Widget)
  - Respect des préférences `prefers-reduced-motion`

---

## 📦 Feature: **Data / Projects**
Ajout nouveau projet.

- [home25/public/projects.json](home25/public/projects.json)
  - Ajout projet `homeassistant` → https://homeassistant.linkenparis.com/

---

## 📖 Documentation
Guide de déploiement production.

- **NEW** [DEPLOY.md](DEPLOY.md)
  - Stack : Angular SSR (port 4000) + Express backend (port 3000) + Nginx
  - Build instructions
  - Config PM2 (processus management)
  - Config Nginx (reverse proxy + static)
  - HTTPS avec Certbot
  - Variables d'environnement

---

## 📊 Résumé des changements

| Catégorie | Fichiers | Type |
|-----------|----------|------|
| **Core/Directives** | 1 nouveau | ✨ Nouvelle fonction 3D partagée |
| **Weather** | 3 modifiés | 🔧 Refactorisation (logique → directive) |
| **Layout/Main** | 3 modifiés | 🎨 Restructuration layout + time widget |
| **Global Styles** | 1 modifié | 🎨 Variables CSS + .card-3d |
| **Data** | 1 modifié | 📝 Ajout homeassistant |
| **Documentation** | 1 nouveau | 📖 Guide déploiement complet |
| **TOTAL** | **10 fichiers** | — |

---

## 🔄 Flux de dépendances

```
styles.scss (variables + .card-3d)
    ↓
core/directives/card-3d.directive.ts (réutilisable)
    ↓
    ├─→ features/weather/ (utilise directive)
    └─→ layout/main/ (utilise directive)
```

Avant : chaque composant avait sa propre logique 3D  
Après : logique 3D centralisée → maintenance + réutilisabilité ✅
