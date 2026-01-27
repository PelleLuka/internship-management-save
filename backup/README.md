# Service de Backup Dockerisé

Ce dossier contient la configuration pour le service de sauvegarde automatique de la base de données.

## Architecture

Le service `backup` est un conteneur léger (**Alpine Linux**) qui tourne parallèlement à la base de données.
Il ne stocke aucune donnée persistante lui-même, mais utilise :
1.  Un **Volume Partagé** (`/backups` sur le conteneur <-> `backups/` sur l’hôte) pour stocker les fichiers SQL.
2.  Le **Réseau Docker** pour se connecter au service `database` via le port 3306.

## Planification (Cron)

Les sauvegardes sont automatisées via **Cron** à l'intérieur du conteneur.
*   **Fréquence** : Tous les Lundis à 06:00.
*   **Configuration** : Fichier `docker/backup/crontab`.

```cron
0 6 * * 1 /scripts/backup.sh
```

## Scripts Disponibles

Les scripts sont montés dans `/scripts` à l'intérieur du conteneur.

### 1. Sauvegarde Manuelle (`backup.sh`)
Génère un dump SQL horodaté dans le dossier de backups.

**Commande :**
```bash
docker compose exec backup /scripts/backup.sh
```

### 2. Restauration (`restore.sh`)
Restaure la base de données à partir d'un fichier spécifique.
**Attention :** Cette opération peut écraser les données existantes.

**Commande :**
```bash
docker compose exec backup /scripts/restore.sh <nom_du_fichier.sql>
```
*Exemple : `docker compose exec backup /scripts/restore.sh backup_2026-01-27_14-00-00.sql`*

## Emplacement des Fichiers
Sur votre machine hôte (Mac), les fichiers de sauvegarde se trouvent dans le dossier du projet :
`Test-internship-management/backup/data/`
