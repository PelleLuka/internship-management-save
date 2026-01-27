# Documentation des Tests

Ce dossier centralise la stratégie d'assurance qualité (QA) du projet.
Il combine des tests d'intégration API et des tests de bout en bout (E2E) pour garantir la robustesse de l'application.

## Architecture des Tests

### Choix Technologique : Pourquoi Playwright ?
Nous avons choisi **Playwright** plutôt que Cypress ou Selenium pour les raisons suivantes :
*   **Vitesse** : Exécution parallèle native et moteur plus léger.
*   **Fiabilité** : Attente automatique ("Auto-wait") des éléments, réduisant les "Flaky tests".
*   **Navigateurs** : Support natif de Chromium, Firefox et **WebKit (Safari)**.
*   **Fonctionnalités** : Support multi-onglets, multi-utilisateurs et mode `codegen` pour générer des tests.

### Schéma des Flux (Architecture)
Ce diagramme illustre comment les tests interagissent avec le système :

```mermaid
graph TD
    %% Noeuds Principaux
    PKG[package.json]
    
    subgraph API_TESTS [Tests API (Postman)]
        RUN_SH[run_tests.sh]
        NEWMAN[Newman CLI]
        COLL[collection.json]
    end

    subgraph E2E_TESTS [Tests E2E (Playwright)]
        CONFIG[playwright.config.ts]
        SPECS[*.spec.ts Files]
        REPORT[playwright-report/]
    end

    subgraph DB_UTILS [Database Utilities]
        RESTORE_JS[restoreDb.js]
        RESTORE_SQL[restore_db.sql]
    end

    %% Liens Scripts NPM
    PKG -- "npm run test:e2e" --> RESTORE_JS
    PKG -- "npm run test:e2e" --> E2E_TESTS
    PKG -- "npm run test:api" --> RESTORE_JS
    PKG -- "npm run test:api" --> RUN_SH
    
    RUN_SH --> NEWMAN
    NEWMAN --> COLL
    
    E2E_TESTS --> CONFIG
    CONFIG --> SPECS
    SPECS --> REPORT
    
    RESTORE_JS --> RESTORE_SQL
```

### 1. Tests API (Backend Integration)
Situé dans `tests/api/`. Utilise **Postman** et **Newman CLI**.
*   **Objectif** : Valider le contrat d'interface, les codes HTTP (200, 400, 404, 500), et la logique métier brute sans interface graphique.
*   **Fichiers Clés** :
    *   `test_internship_management.postman_collection.json` : La collection de tests.
    *   `postman_environment.json` : Variables d'environnement (URL Backend).
    *   `run_tests.sh` : Script d'exécution automatique.
*   **Coverage** : CRUD complet + Cas limites (Injections SQL, XSS, Validation inputs).
*   **Exécution** :
    ```bash
    npm run test:api
    ```
    *Note : Cette commande inclut automatiquement un reset de la base de données (`db:restore`).*

### 2. Tests E2E (Frontend + Backend)
Situé dans `tests/e2e/`. Utilise **Playwright**.
*   **Objectif** : Simuler un utilisateur réel sur Chrome/Firefox/Safari. Clique sur les boutons, remplit les formulaires, vérifie l'affichage.
*   **Coverage** :
*   **Coverage (Plan de Tests Détaillé)** :

    #### 1. Navigation & Affichage
    *   **SC01 - Accueil** : Redirection auto vers `/internships`, titre visible.
    *   **SC02 - Menu** : Navigation entre "Stagiaires" et "Activités".

    #### 2. Gestion des Stagiaires
    *   **SC03 - Création** : Formulaire complet (Happy Path).
    *   **SC04 - Validation** : Champs requis, cohérence date fin > début.
    *   **SC05 - Modification** : Mise à jour d'un champ (ex: email).
    *   **SC06 - Suppression** : Check de la modale de confirmation.

    #### 3. Gestion des Activités
    *   **SC07 - CRUD Activité** : Créer, Modifier, Supprimer une activité.

    #### 4. Relations (Associations)
    *   **SC08 - Association** : Lier une activité "Tennis" à un stagiaire.
    *   **SC09 - Dissociation** : Retirer l'activité.

    #### 5. Fonctionnalités Avancées
    *   **SC10 - Recherche** : Filtrage de liste (Nom/Prénom).
    *   **SC11 - Résilience** : Gestion erreur 500 (Simulée avec Network Mocking).
    *   **SC12 - Tri** : Ordre d'affichage.
    *   **SC13 - Persistance Formulaire** : Nettoyage après fermeture modale.
    *   **SC14 - Accessibilité Clavier** : Formulaire utilisable sans souris (Tab/Enter).

    #### 6. Sécurité & Limites
    *   **SC15 - Doublons Audit** : Création d'un email existant.
    *   **SC16 - Sécurité XSS** : Injection de payloads `<script>`.
    *   **SC17 - Limites** : Champs max length (50/255 chars).
    *   **SC20 - Validation Dates** : Cas spécifiques de dates.
*   **Exécution** :
    ```bash
    npm run test:e2e
    ```
    *Note : Cette commande ("Clean Run") exécute séquentiellement le Reset DB, le Sanity Check, puis tous les scénarios.*

### 3. Utilitaires (Setup)
Situé dans `tests/setup/`.
*   `restoreDb.js` : Script Node.js qui connecte à MariaDB et ré-exécute le fichier SQL de référence.
*   `restore_db.sql` : Dump SQL contenant l'état "d'usine" (Factory Reset) de la base (60 stagiaires).

## Workflow de Test Recommandé

Pour éviter les faux positifs dus à des données corrompues, les commandes NPM ci-dessus nettoient automatiquement l'environnement avant les tests.

### Mécanismes Avancés (Interne)

La collection Postman utilise des scripts sophistiqués pour garantir la robustesse :

1.  **Contract Testing (Validation de Schéma)** :
    *   Un script global intercepte chaque réponse `GET 200`.
    *   Il valide automatiquement que la structure JSON correspond au schéma défini (types, champs requis), garantissant que l'API respecte son contrat.

2.  **Self-Healing (Auto-Nettoyage)** :
    *   Avant de créer une donnée de test (ex: email spécifique), le script vérifie si elle existe déjà et la supprime.
    *   Cela évite les erreurs de "Duplication" si un test précédent a échoué avant son nettoyage.

### Limitations Connues
*   **Filtrage API** : Le backend actuel ne supporte pas encore le filtrage par paramètres URL (ex: `GET /internships?firstName=John` renvoie toute la liste sans filtrer). Les tests de filtrage sont donc volontairement absents.

## Commandes d'Exécution

| Commande | Action | Détails |
| :--- | :--- | :--- |
| `npm run test:api` | Tests Postman | `db:restore` + `run_tests.sh` |
| `npm run test:e2e` | Tests Playwright | `db:restore` + `sanity check` + `playwright test` |
| `npm run db:restore` | Reset BDD | Restaure uniquement la base de données. |

## Créer un nouveau test E2E (Astuce Codegen)

Pour créer rapidement un scénario sans écrire de code manuellement :

1.  Lancez le **Générateur de Code** Playwright :
    ```bash
    npx playwright codegen localhost:5173
    ```
2.  Un navigateur s'ouvre. Interagissez avec votre site (cliquez, remplissez les formulaires...).
3.  Playwright **génère le code** correspondant en temps réel dans l'inspecteur.
4.  Copiez ce code dans un nouveau fichier `.spec.ts` dans `tests/e2e/tests/`.

## Rapports et Débogage

### Tests E2E (Playwright)
*   **Rapport HTML** : Généré automatiquement après `npm run test:e2e` dans `tests/e2e/playwright-report/index.html`.
*   **Visualisation** :
    ```bash
    npx playwright show-report tests/e2e/playwright-report
    ```
*   **Mode UI** : Pour voir les tests s'exécuter pas à pas :
    ```bash
    npx playwright test --ui
    ```

### Tests API (Postman)
*   **Rapport HTML** : Généré automatiquement après `npm run test:api` dans `test-results/api/report.html`.
*   **Visualisation** : Ouvrez simplement ce fichier dans votre navigateur (Chrome/Firefox).
    ```bash
    open test-results/api/report.html  # Sur Mac
    ```

Pour plus de détails méthodologiques, voir `documentation/STRATEGIE_TESTS_E2E.md`.
