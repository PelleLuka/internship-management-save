# Documentation Backend

Ce dossier contient le code source de l'API REST (Backend) du projet Internship Management.
Il est construit avec **Node.js** et **Express**, et suit une architecture en couches (Controller-Service-Model) pour séparer proprement les responsabilités.

## Structure et Architecture

L'application est structurée de manière modulaire pour faciliter la maintenance et les tests.

### 1. Routes (`routes/`)
Porte d'entrée de l'API. Définit les URLs et délègue le traitement au Contrôleur approprié.

*   **`internshipRoutes.js`** : Définit les routes `/api/internships` (GET, POST, PUT, DELETE).
*   **`activityRoutes.js`** : Définit les routes `/api/activities`.
*   **`healthRoutes.js`** : Route `/health` pour vérifier l'état du serveur (utilisé par Docker).

### 2. Controllers (`controllers/`)
Chef d'orchestre des requêtes HTTP.
Ils extraient les paramètres (body, params), appellent les **Services**, et renvoient la réponse HTTP (JSON, codes d'erreur). Ils ne contiennent pas de SQL pur ni de logique métier complexe.

*   **`internshipController.js`** : Gère les requêtes HTTP liées aux stagiaires.
*   **`activityController.js`** : Gère les requêtes HTTP liées aux activités.
*   **`healthController.js`** : Répond 'OK' si le serveur est en ligne.

### 3. Services (`services/`)
Contient la **Logique Métier**.
C'est la couche intermédiaire qui fait le lien entre le Contrôleur (Web) et le Modèle (Data). Elle permet d'isoler les règles de gestion.

*   **`internshipService.js`** :
    *   Validation des données métier.
    *   Orchestration des appels aux modèles (ex: pour lier une activité à un stagiaire, vérifier si le stagiaire existe d'abord).
    *   Formatage des données avant envoi au contrôleur.
*   **`activityService.js`** : Logique de gestion des activités (ex: gestion du Soft Delete si applicable).

### 4. Models (`models/`)
Couche d'accès aux données (**DAO**).
Contient les requêtes SQL brutes pour interagir avec **MariaDB**. C'est le seul endroit qui connaît la structure de la base de données.

*   **`Internship.js`** : Classes/Fonctions pour `SELECT`, `INSERT`, `UPDATE` sur la table `internship`. Gère aussi la table de liaison `internship_activity`.
*   **`Activity.js`** : Requêtes SQL pour la table `activity`.

### 5. Config (`config/`)
*   **`db.js`** : Configuration du Pool de connexions MariaDB. Gère les reconnexions et les erreurs de base de données.

---

## Fonctionnalités et Endpoints

### Stagiaires (`/api/internships`)
*   `GET /` : Liste de tous les identifiants de stagiaires.
*   `GET /:id` : Détails complets d'un stagiaire (incluant ses activités liées).
*   `POST /` : Création d'un nouveau stagiaire.
*   `PUT /:id` : Mise à jour des informations d'un stagiaire.
*   `DELETE /:id` : Suppression d'un stagiaire.
*   `GET /:id/activities` : Liste des activités spécifiques à un stagiaire.
*   `POST /:id/activities/:activityId` : Association d'une activité à un stagiaire.
*   `DELETE /:id/activities/:activityId` : Dissociation d'une activité.

### Activités (`/api/activities`)
*   `GET /` : Liste des activités (filtrée par visibilité).
*   `GET /:id` : Détails d'une activité.
*   `POST /` : Création d'une activité.
*   `PATCH /:id` : Mise à jour partielle (Titre et/ou Visibilité).
*   `DELETE /:id` : Suppression (Souvent implémenté en 'Soft Delete' : `visible=0`).

### Système
*   `GET /health` : Healthcheck pour Docker/Kubernetes.

---

## Commandes NPM (Scripts)

Ces scripts sont définis dans le `package.json` et sont principalement utilisés **par Docker** pour démarrer le service. Ils peuvent aussi servir à lancer le backend isolément pour du debug rapide.

*   `npm run dev` (ou `dev:backend` depuis le root) :
    *   Lance le serveur avec `node --watch`.
    *   Utilisé par le conteneur Docker pour assurer le **Hot-Reload**.
*   `npm run start` :
    *   Lance le serveur en mode production standard (`node server.js`). 
    *   Optimisé pour la performance (pas de watch).

## Configuration Environnement

L'application nécessite un fichier `.env` à la racine du projet (ou des variables d'environnement système) pour se connecter à la base de données :

```bash
DB_HOST=localhost       # Host (localhost en dev local, 'database' dans Docker)
DB_USER=user            # Utilisateur MariaDB
DB_PASSWORD=password    # Mot de passe
DB_NAME=internship_management
PORT=3000               # Port d'écoute API
```
