#!/bin/bash

# Configuration
DB_HOST="database" # Service name in Docker Compose
DB_USER="user"
DB_PASS="password"
DB_NAME="internship_management"
BACKUP_DIR="/data"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="$BACKUP_DIR/backup_$TIMESTAMP.sql"

echo "[$(date)] Starting backup of database '$DB_NAME'..."

# Run dump
# Note: Using mariadb-dump (compatible with mysqldump)
mariadb-dump -h "$DB_HOST" -u "$DB_USER" --password="$DB_PASS" "$DB_NAME" > "$FILENAME"

if [ $? -eq 0 ] && [ -s "$FILENAME" ]; then
  echo "[$(date)] Backup successful: $FILENAME"
  # Keep only last 5 backups (optional, basic rotation)
  # ls -t $BACKUP_DIR/backup_*.sql | tail -n +6 | xargs -r rm --
else
  echo "[$(date)] Backup failed!"
  rm -f "$FILENAME"
  exit 1
fi
