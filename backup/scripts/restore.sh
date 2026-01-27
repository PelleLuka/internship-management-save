#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <filename>"
  echo "Available backups:"
  ls -lh /data/*.sql
  exit 1
fi

FILENAME="/data/$1"

if [ ! -f "$FILENAME" ]; then
  echo "File not found: $FILENAME"
  exit 1
fi

# Configuration
DB_HOST="database"
DB_USER="user"
DB_PASS="password"
DB_NAME="internship_management"

echo "WARNING: This will OVERWRITE the database '$DB_NAME'."
echo "Restoring from: $FILENAME"
echo "Starting in 5 seconds... (Ctrl+C to cancel)"
sleep 5

# Restore
mariadb -h "$DB_HOST" -u "$DB_USER" --password="$DB_PASS" "$DB_NAME" < "$FILENAME"

if [ $? -eq 0 ]; then
  echo "Restore successful!"
else
  echo "Restore failed!"
  exit 1
fi
