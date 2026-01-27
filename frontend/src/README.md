# Documentation du Code Source (Frontend)

Ce dossier **`src`** contient toute la logique de l'application Vue.js.

## 📂 Architecture des Dossiers

L'architecture suit une approche **Type-Driven (Classique)**, simple et efficace.

*   **`assets/`** : Ressources statiques (images, fonts).
*   **`components/`** : Tous les composants Vue.js (Boutons, Modales, Cartes, etc.).
*   **`views/`** : Les pages complètes de l'application (correspondant aux routes).
*   **`services/`** : Logique métier et appels API (ex: `internshipService`).
*   **`layouts/`** : Gabarits de pages (Ex: Layout avec Sidebar pour le dashboard).
*   **`composables/`** : Hooks Vue.js réutilisables (logique partagée, ex: `useMediaQuery`).
*   **`router.js`** : Configuration des routes (URL -> Vue).

## 📄 Fichiers Principaux

*   **`App.vue`** : Le conteneur principal. Il définit généralement le `<router-view>` où les pages s'affichent.
*   **`main.js`** : Point d'entrée. C'est ici qu'on :
    1.  Crée l'app Vue (`createApp`).
    2.  Installe les plugins (Router, Pinia, etc.).
    3.  Monte l'application dans le DOM (`#app`).
