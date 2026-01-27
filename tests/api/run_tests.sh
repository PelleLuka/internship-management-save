#!/bin/bash

# Ensure script execution independent of current working directory
cd "$(dirname "$0")"

echo "🔄 Restoring Database..."
npm --prefix ../../ run db:restore

echo "🏥 Running Sanity Checks (Database Integrity)..."
npx newman run sanity_check.postman_collection.json -e postman_environment.json
if [ $? -ne 0 ]; then
    echo "❌ Sanity Check Failed! Aborting tests."
    exit 1
fi

echo "🚀 Running Internship Management API Tests..."
REPORT_DIR="../../test-results/api"
mkdir -p "$REPORT_DIR"

npx newman run test_internship_management.postman_collection.json \
    -e postman_environment.json \
    -r cli,htmlextra \
    --reporter-htmlextra-export "$REPORT_DIR/report.html" \
    --reporter-htmlextra-title "Internship Management API Report" \
    | tee postman.log

echo "✅ Tests Completed. Report generated at: $REPORT_DIR/report.html"
