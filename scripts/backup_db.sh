#!/bin/bash

# Configuration
# Note: The container name 'docker-database-1' is derived from 'docker-compose.yml' service name 'database' + project context.
# If connection fails, check 'docker ps' for the exact name.
DB_CONTAINER="docker-database-1"
DB_USER="user"
DB_PASS="password"
DB_NAME="internship_management"
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup of database '$DB_NAME' from container '$DB_CONTAINER'..."

# Execute mariadb-dump inside the container and pipe output to host file
docker exec "$DB_CONTAINER" /usr/bin/mariadb-dump -u "$DB_USER" --password="$DB_PASS" "$DB_NAME" > "$FILENAME"

# Check if the command succeeded (based on file size and exit code)
if [ $? -eq 0 ] && [ -s "$FILENAME" ]; then
  echo "✅ Backup successful: $FILENAME"
  # Display file size
  ls -lh "$FILENAME"
else
  echo "❌ Backup failed!"
  # Remove empty file if created
  [ -f "$FILENAME" ] && rm "$FILENAME"
  exit 1
fi
