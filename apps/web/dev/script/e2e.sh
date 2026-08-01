#!/usr/bin/env bash
set -euo pipefail

# ── Portal picker ──────────────────────────────────────────────────
echo ""
echo "  Portal:"
echo "    1) user-portal"
echo "    2) admin-portal"
echo "    3) both (default)"
echo "    4) inactivity (user-portal with short timeouts)"
echo ""
read -rp "  Choose [1/2/3/4]: " portal_choice

inactivity_env=""
case "${portal_choice:-3}" in
  1) project="--project=user-portal" ;;
  2) project="--project=admin-portal" ;;
  4) project="--project=user-portal-inactivity"
     inactivity_env="E2E_INACTIVITY_ENABLED=true" ;;
  *) project="" ;;
esac

# ── Mode picker ────────────────────────────────────────────────────
echo ""
echo "  Mode:"
echo "    1) headless (default)"
echo "    2) headed"
echo "    3) ui"
echo ""
read -rp "  Choose [1/2/3]: " mode_choice

case "${mode_choice:-1}" in
  2) mode="--headed" ;;
  3) mode="--ui" ;;
  *) mode="" ;;
esac

# ── Run ────────────────────────────────────────────────────────────
cmd="${inactivity_env:+$inactivity_env }npx playwright test ${project} ${mode}"
echo ""
echo "  → $cmd"
echo ""
exec env ${inactivity_env:-} npx playwright test ${project} ${mode}
