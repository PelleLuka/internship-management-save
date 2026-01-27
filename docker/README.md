# Documentation Docker

Ce dossier contient la configuration pour l'orchestration des conteneurs via **Docker Compose**.
L'environnement déploie 3 services interconnectés pour garantir un environnement de développement iso-prod.

## Services Définis (`docker-compose.yml`)

### 1. `frontend` (Vue.js)
*   **Image Base** : `node:20-alpine` (via `frontend/Dockerfile`).
*   **Justification** : Version LTS de Node.js sur une base Alpine Linux ultra-légère (< 50MB) pour réduire la surface d'attaque et accélérer les builds.
*   **Ports** : Expose le port interne `5173` (Vite) sur le port hôte `8081`.
*   **Volumes** : Le code source est monté en miroir (`./frontend:/app`) pour permettre le **Hot Reload** (HMR).
*   **Dépendance** : Attend que `backend` soit lancé.

### 2. `backend` (Node API)
*   **Image Base** : `node:20-alpine` (via `backend/Dockerfile`).
*   **Justification** : Même base que le frontend pour la cohérence. Utilisation de `nodemon` (implémenté via `node --watch`) pour le rechargement automatique.
*   **Ports** : Expose le port interne `3000` sur le port hôte `3000`.
*   **Volumes** : Code source monté (`./backend:/app`) pour redémarrage automatique.
*   **Dépendance** : Attend que `database` soit prêt (healthcheck).

### 3. `database` (MariaDB)
*   **Image Officielle** : `mariadb:10.5`.
*   **Justification** : Version stable et légère de MariaDB, parfaitement compatible avec le driver Node.js utilisé.
*   **Ports** : Expose le port standard `3306`.
*   **Volumes** :
    *   `mariadb_data` (Volume nommé) : Persistance des données même après arrêt du conteneur.
    *   `./database/schema.sql` (Read-only) : Script d'initialisation monté dans `/docker-entrypoint-initdb.d/`.
*   **Environnement** : Variables `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, etc. définies dans le `.env`.

## Développement & Hot-Reloading

Cette configuration Docker est optimisée pour le **Développement**.
Elle supporte le rechargement à chaud (Hot-Reloading) pour le frontend et le backend :

*   **Backend (`node --watch`)** : Le dossier `backend/` de votre machine est synchronisé. Toute modification d'un fichier `.js` redémarre automatiquement le serveur Node.
*   **Frontend (`vite`)** : Le dossier `frontend/` est également synchronisé. Le conteneur exécute le serveur de dev Vite. Les changements CSS ou Vue sont appliqués instantanément dans le navigateur (HMR).

## Commandes Essentielles

| Action | Commande | Description |
| :--- | :--- | :--- |
| **Démarrer** | `docker-compose up -d` | Lance tout en arrière-plan. |
| **Reconstruire** | `docker-compose up --build -d` | Force la reconstruction des images (à faire après `npm install`). |
| **Arrêter** | `docker-compose stop` | Met en pause les conteneurs sans les supprimer. |
| **Supprimer** | `docker-compose down` | Arrête et supprime conteneurs et réseaux. |
| **Reset Total** | `docker-compose down -v` | **Attention** : Supprime aussi le volume de base de données (Reset BDD). |
| **Logs** | `docker-compose logs -f` | Affiche les logs de tous les services en temps réel. |
| **Logs Service** | `docker-compose logs -f backend` | Affiche les logs uniquement du backend. |

## Accès et Identifiants

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:8081](http://localhost:8081) | Interface Utilisateur Vue.js |
| **Backend API** | [http://localhost:3000](http://localhost:3000) | API Node.js/Express |
| **Base de Données** | `localhost:3306` | Accès direct MariaDB |

**Identifiants Base de Données** (pour client SQL externe) :
*   **Hôte** : `localhost`
*   **Port** : `3306`
*   **User** : `user`
*   **Password** : `password`
*   **Database** : `internship_management`

## Outils Recommandés (VS Code)

Pour gérer Docker et la BDD directement depuis l'éditeur :

1.  **Docker** (Microsoft) : Pour voir les conteneurs actifs et les logs.
2.  **SQLTools** (M. Teixeira) : Pour se connecter à MariaDB, exécuter des requêtes et voir les tables.

## Troubleshooting

*   **Conflit de Port** : Si vous avez une erreur `bind: address already in use`, vérifiez qu'aucun autre processus n'utilise les ports 3000 ou 8081.
*   **Erreur Connexion DB** : Le conteneur `database` peut prendre quelques secondes à s'initialiser la première fois. Vérifiez son état avec `docker-compose ps`.
