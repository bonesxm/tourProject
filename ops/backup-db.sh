#!/usr/bin/env bash
set -euo pipefail

TS="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="${1:-./backups}"
mkdir -p "$OUT_DIR"

docker compose exec -T postgres pg_dump -U smart_tourism smart_tourism > "${OUT_DIR}/smart_tourism_${TS}.sql"
echo "Backup saved to ${OUT_DIR}/smart_tourism_${TS}.sql"

