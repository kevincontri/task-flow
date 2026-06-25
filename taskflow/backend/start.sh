#!/bin/bash
set -e
cd /app

# Neon (free tier) auto-suspends when idle; the first connection has to wake it
# and can briefly time out. Retry so a cold-start timeout doesn't crash the boot
# and trigger a Render restart loop. The schema is already at head, so this is a
# no-op once the connection succeeds.
for attempt in 1 2 3 4 5; do
  if alembic upgrade head; then
    echo "Migrations up to date."
    break
  fi
  echo "Migration attempt $attempt failed (database may be waking up); retrying in 5s..."
  sleep 5
done

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
