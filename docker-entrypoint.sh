#!/bin/sh
set -e

echo "Running database migrations..."
node dist/src/core/datasource.js || echo "⚠️  Migration failed or no migrations to run"

echo "🚀 Starting application..."
exec node dist/src/main
