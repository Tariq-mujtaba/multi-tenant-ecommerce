#!/usr/bin/env bash
set -euo pipefail

echo "Checking pnpm..."
pnpm -v

echo "Checking turbo..."
pnpm exec turbo --version

echo "Checking Compose (dev profile)..."
docker compose --profile dev config >/dev/null

echo "Checking Compose (prod profile)..."
docker compose --profile prod config >/dev/null

echo "Doctor checks passed."
