# Système de Gestion des Stages

## Résumé Général

Le "Système de Gestion des Stages" est une application web moderne conçue pour simplifier la gestion administrative des stages en entreprise. Elle permet aux administrateurs de gérer efficacement les dossiers des stagiaires, leurs activités et le suivi temporel de leurs contrats.

Le projet consiste à développer une application web permettant le suivie centralisé de stage de deux jours réalisé par de étudiant du cycle d'orientation. Elle permet de recensé les stagiaires ainsi que les activités des stages pour une administration facilité pour l'équipe. Ces stages sont réalisé au sein de la HEIA-FR.

L'application est construite sur une architecture **Full-Stack JavaScript** robuste, utilisant Vue.js pour une interface utilisateur réactive et Node.js pour une API performante.

### Fonctionnalités Clés

*   **Gestion des Stagiaires** : Création, modification et archivage des dossiers (Identité, Dates de stage, Email).
*   **Catalogue d'Activités** : Gestion centralisée des types d'activités proposées (ex: Développement, Design, Réunion).
*   **Association Flexible** : Possibilité d'attribuer plusieurs activités à un stagiaire spécifique.
*   **Validation Intelligente** : Contrôles de saisie avancés (cohérence des dates, format email) pour garantir l'intégrité des données.
*   **Interface Responsive** : Design adapté aux bureaux et tablettes.

---

## Stack Technologique

Le projet s'appuie sur une sélection de technologies modernes et performantes.

### Frontend (Interface)
*   **Vue.js 3** : Framework JavaScript progressif utilisé avec la **Composition API** pour une gestion d'état modulaire.
*   **Vite** : Outil de construction (bundler) nouvelle génération, offrant un démarrage instantané et un Hot Module Replacement (HMR) ultra-rapide.
*   **Tailwind CSS** : Framework CSS utilitaire pour un design rapide, responsive et cohérent sans écrire de CSS standard.
*   **Axios** : Client HTTP basé sur les promesses pour communiquer avec l'API Backend.
*   **Lucide Icons** : Bibliothèque d'icônes SVG légères et modernes.

### Backend (Serveur)
*   **Node.js** (v20+) : Environnement d'exécution JavaScript côté serveur.
*   **Express.js** : Framework web minimaliste et flexible pour structurer l'API REST.
*   **MariaDB** : Système de gestion de base de données relationnelle (SGBDR) SQL, forked de MySQL.
*   **MariaDB Connector** : Driver officiel pour exécuter des requêtes SQL performantes depuis Node.js.

### Outils & DevOps
*   **Docker & Docker Compose** : Conteneurisation complète de l'application (Frontend, Backend, Database) pour garantir un environnement de développement identique à la production.
*   **NPM Workspaces** : Gestion monorepo permettant de partager les dépendances et d'orchestrer les scripts depuis la racine.
*   **Biome** : Outil tout-en-un ultra-rapide pour le linting (qualité de code) et le formatage (style standardisé).

### Assurance Qualité (Tests)
*   **Playwright** : Framework de tests de bout en bout (E2E) pour simuler des scénarios utilisateurs réels sur différents navigateurs (Chromium, Firefox, WebKit).
*   **Postman & Newman** : Suite de tests d'intégration pour valider le contrat d'interface de l'API Backend.

---

## Fonctionnement Technique

L'application repose sur le modèle **Client-Serveur** classique, orchestré via Docker pour faciliter le déploiement et le développement.

1.  **Interface Utilisateur (Navigateur)** :
    *   Le client charge l'application **Vue.js**.
    *   Toutes les interactions (clics, formulaires) se font de manière fluide sans rechargement de page (SPA - Single Page Application).
    *   Elle communique avec le serveur via des requêtes HTTP asynchrones (API REST).

2.  **Serveur API (Backend)** :
    *   Reçoit les demandes du frontend (ex: "Créer un stagiaire").
    *   Vérifie les règles métier (ex: "La date de fin est-elle après le début ?").
    *   Communique avec la base de données via SQL.
    *   Renvoie les données au format JSON.

3.  **Stockage (Base de Données)** :
    *   Une base relationnelle **MariaDB** stocke toutes les informations de manière persistante et structurée.

---

## Structure Détaillée du Projet

Le code est organisé sous forme de **Monorepo** géré par NPM Workspaces, ce qui permet de tout centraliser dans un seul dépôt git.

### Racine du Projet
*   **`package.json`** : Chef d'orchestre. Définit les scripts globaux pour lancer le projet, les tests ou le formatage de code.
*   **`docker/`** : Contient la "recette" pour construire l'infrastructure virtuelle (Docker Compose).
*   **`tests/`** : Dossier dédié à l'assurance qualité (Tests API automatisés et Simulations utilisateur E2E).

### Frontend (`/frontend`)
*L'interface visible par l'utilisateur.*
*   **`src/views/`** : Les écrans principaux (Tableau de bord, Liste des activités).
*   **`src/components/`** : Les briques réutilisables (Boutons, Champs de texte, Modales).
*   **`src/services/`** : Le pont vers le Backend (Fichiers contenant les appels API).
*   **Technologie** : Vue.js 3, Vite, Tailwind CSS.

### Backend (`/backend`)
*Le cerveau de l'application.*
*   **`server.js`** : Point d'entrée du serveur.
*   **`routes/`** : Le guichet d'accueil qui dirige les requêtes vers le bon service.
*   **`controllers/`** : La logique décisionnelle (Vérification des données).
*   **`models/`** : L'accès brut aux données (Requêtes SQL).
*   **Technologie** : Node.js, Express, MariaDB Connector.

### Database (`/database`)
*La mémoire du système.*
*   **`schema.sql`** : Le plan de construction de la base de données (Définition des tables et relations).

---

## Contribution & Workflow
 
Le projet suit strictement le modèle **Gitflow** pour garantir la stabilité du code.
 
### Branches Principales
*   **`main`** : Code de production stable. Ne fusionner ici que pour les releases.
*   **`develop`** : Branche d'intégration principale. C'est ici que les nouvelles fonctionnalités convergent.
 
### Branches Temporaires
Pour chaque tâche, créez une branche spécifique depuis `develop` :
 
1.  **Fonctionnalité** (`feature/nom-feature`) :
    *   *Source* : `develop`
    *   *Exemple* : `feature/auth-login`
    *   *Merge* : Pull Request (PR) vers `develop` (Squash & Merge recommandé).
 
2.  **Correctif Urgent** (`hotfix/nom-fix`) :
    *   *Source* : `main` (Uniquement si bug critique en prod)
    *   *Merge* : Vers `main` ET `develop`.
 
### Convention de Commit (Conventional Commits)
Les messages de commit doivent suivre la spécification **Conventional Commits** :

```text
<type>(<portée>): <description courte>

[Description détaillée optionnelle]

[Footer optionnel (ex: Closes #123)]
```

#### Types Autorisés
*   **`feat`** : Nouvelle fonctionnalité pour l'utilisateur.
*   **`fix`** : Correction de bug.
*   **`docs`** : Documentation uniquement.
*   **`style`** : Formatage (espaces, point-virgules) sans impact sur le code.
*   **`refactor`** : Modification de code (ni fix ni feat).
*   **`perf`** : Amélioration de performance.
*   **`test`** : Ajout ou modification de tests.
*   **`chore`** : Maintenance (mise à jour dépendances, scripts de build).

#### Exemples
*   `feat(auth): ajouter la connexion par email`
*   `fix(api): corriger le crash sur les IDs invalides`
*   `test(e2e): ajouter le scénario de création de stage`
*   `docs(readme): mettre à jour les instructions d'installation`
 
---
 
## Démarrage Rapide
 
Pour tester l'application sur votre machine en quelques minutes (nécessite Docker) :
 
1.  Ouvrez un terminal à la racine du projet.
2.  Allez dans le dossier docker : `cd docker`
3.  Lancez l'application : `docker-compose up --build -d`
4.  Accédez à l'interface : **http://localhost:8081**

---

## Roadmap / Améliorations Futures

Ces fonctionnalités ne sont pas encore implémentées mais représentent les prochaines étapes du développement :

*   **Authentification & Sécurité**
    *   [ ] Système de Login / Logout (JWT ou Session).
    *   [ ] Gestion des Rôles (Administrateurs vs Étudiants).
    *   [ ] Protection des routes API.

*   **Fonctionnalités Avancées**
    *   [ ] Filtrage avancé des stages (par entreprise, date, statut).
    *   [ ] Recherche textuelle performante côté serveur.
    *   [ ] Upload de fichiers (CV, Lettre de motivation).

*   **Ops**
    *   [ ] Pipeline CI/CD (GitHub Actions).
    *   [ ] Migrations de base de données automatisées.
