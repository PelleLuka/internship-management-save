# Documentation Frontend - Architecture 2026

Ce document détaille l'architecture actuelle du frontend "Internship Management", refondue pour être modulaire, maintenable et performante.

## 🏗️ Architecture Globale : "Atomic Views"

L'architecture repose sur une séparation claire entre la **Logique Métier** (Composables), la **Structure** (Layouts/Vues) et les **Composants d'UI** (Atomes).

### 1. Composables (`src/composables/`) - Le Cerveau 🧠
La logique métier ne réside plus dans les fichiers `.vue`. Elle est extraite dans des hooks réutilisables :

*   **`useInternships.js`** : CRUD complet des stagiaires, tri, filtrage, suppression.
*   **`useActivities.js`** : Gestion du catalogue d'activités et de l'assignation (Menu déroulant).
*   **`useMasonryGrid.js`** : Algorithme de calcul des colonnes pour la grille fluide.
*   **`useMediaQuery.js`** : Gestion réactive des breakpoints (Mobile vs Desktop).

### 2. Vues Responsives (`src/views/dashboard/`) - Le Squelette 🦴
Au lieu d'un seul fichier rempli de `v-if` et de classes CSS complexes, nous avons deux vues distinctes :

*   **`DashboardDesktop.vue`** (PC/Tablette) :
    *   Affiche une Sidebar de navigation latérale.
    *   Utilise une grille large (2 ou 3 colonnes).
*   **`DashboardMobile.vue`** (Smartphone) :
    *   Pas de Sidebar (Menu burger et navigation horizontale).
    *   Layout vertical optimisé (1 colonne).
*   **`InternshipDashboard.vue`** (Switch) :
    *   Fichier "intelligent" de 14 lignes qui charge dynamiquement la vue Mobile ou Desktop selon la taille de l'écran.

---

## 🔍 Détail des Composants Atomiques

Cette section décrit en profondeur les composants "briques" utilisés pour construire l'interface.

### 🧱 `DashboardHeader.vue` (Barre d'outils)
C'est le centre de contrôle du tableau de bord. Il s'adapte automatiquement au mobile et au desktop.

*   **Barre de Recherche 🔍** :
    *   Composant : `AppInput` avec icône loupe.
    *   Comportement : Met à jour la variable réactive `searchQuery` en temps réel pour filtrer la liste.
    *   *Mobile* : Masquée par défaut, accessible via un bouton toggle "Loupe" dans la top-bar.
*   **Filtres de Tri 📶** :
    *   Liste déroulante (`select`) : Permet de trier par "Date (Récent/Ancien)" ou "Alphabétique (Nom/Prénom)".
*   **Bouton "Nouveau" ➕** :
    *   Desktop : Bouton `AppButton` complet avec texte "Nouveau".
    *   Mobile : Bouton rond flottant ou icône dans la top-bar.
    *   Action : Ouvre la modale `InternshipFormModal` en mode création.

### 🧭 `SidebarNavigation.vue` (Navigation Latérale)
Uniquement visible sur Desktop, ce composant permet de se repérer dans le temps.

*   **Structure** : Liste arborescente (Année > Mois).
*   **Années (Niveau 1)** : Titres cliquables (ex: "2025"). Un clic scrolle la page vers l'ancre `#year-2025`.
*   **Mois (Niveau 2)** : Sous-liste indentée (ex: "Juin"). Un clic scrolle vers l'ancre `#month-2025-juin`.
*   **Comportement Sticky** : La barre reste fixée à l'écran pendant le défilement du contenu principal.

### 🗂️ `InternshipGroupList.vue` (Liste Groupée)
C'est le composant qui fait le "rendu" de la liste de données.

*   **Rôle** : Reçoit les données groupées `[[2025, [...]], [2024, [...]]]`.
*   **Header Dynamique** : Affiche les titres d'années (`<h2>`) et de mois (`<h3>`).
*   **Gestion du Scroll** : Définit automatiquement les ancres HTML (`id="year-..."`) et gère le `scroll-margin-top` pour que le titre ne soit pas caché par le header fixe lors du scroll.
*   **Grille** : Appelle `MasonryGrid` pour disposer les cartes.

### 🎫 `InternshipCard.vue` (Carte Stagiaire)
L'unité de base qui affiche un stage.

*   **Informations** :
    *   Identité (Prénom, Nom, Email).
    *   Dates (Début - Fin) formatées en français.
*   **Barre d'Actions (Au survol ou Mobile)** :
    *   **✏️ Modifier** : Ouvre la modale pré-remplie.
    *   **🗑️ Supprimer** : Demande confirmation puis supprime le stage.
*   **Zone Expansible (Accordéon)** :
    *   Un clic sur l'en-tête déplie la carte.
    *   Affiche les **Activités** liées (Badges colorés).
    *   **Bouton "+ Ajouter une activité"** : Ouvre un menu popover pour sélectionner des activités à lier au stage.

### 🏗️ `MasonryGrid.vue` (Mise en page)
Un composant technique (sans UI propre) qui gère la distribution spatiale.

*   **Logique** : Calcule sur combien de colonnes (1, 2 ou 3) distribuer les éléments en fonction de `useMediaQuery`.
*   **Slot** : Utilise un `scoped slot` pour permettre au parent de décider *quoi* afficher dans la grille (ici des `InternshipCard`, mais ça pourrait être autre chose).

---

## 📱 Stratégie Responsive

Le responsive n'est plus géré uniquement par CSS (`hidden md:block`), mais par une séparation structurelle :

| Feature | Desktop (>= 891px) | Mobile (< 891px) |
| :--- | :--- | :--- |
| **Navigation** | Sidebar Verticale (Sticky) | Scroll Horizontal (Top Bar) |
| **Grille** | Masonry 2 ou 3 colonnes | Stack Vertical (1 colonne) |
| **Header** | Intégré au contenu | Sticky Top Bar indépendante |
| **Fichier** | `DashboardDesktop.vue` | `DashboardMobile.vue` |

---

## 🚀 Développement & Maintenance

### Ajouter une fonctionnalité
1.  **Logique** : Modifiez ou créez un **Composable**.
    *   *Ex: Ajouter un filtre "Par entreprise" -> Modifier `useInternships.js`.*
2.  **UI** : Modifiez le **Composant Atomique** concerné.
    *   *Ex: Afficher le logo de l'entreprise -> Modifier `InternshipCard.vue`.*
3.  **Layout** : Si nécessaire, ajustez `DashboardDesktop` ou `DashboardMobile` pour la disposition.

### Lancer le projet
```bash
npm run dev:frontend
```
Accès : `http://localhost:5173` (Redirige `/api` vers le backend).
