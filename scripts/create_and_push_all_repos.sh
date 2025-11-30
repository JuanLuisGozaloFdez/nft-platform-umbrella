#!/usr/bin/env bash
set -euo pipefail

BASE="/home/jlg/nft"
REPOS=(
  "admin-event-ops-service"
  "api-gateway-bff"
  "checkin-validation-service"
  "notifications-comms-service"
  "payments-orders-service"
  "ticketing-core-service"
  "users-identity-service"
  "wallet-assets-service"
)

OWNER="JuanLuisGozaloFdez"
FAILED=()
SUCCESS=()

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║ Creating remote repos and pushing all services to GitHub     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo

for name in "${REPOS[@]}"; do
  repo="$BASE/$name"
  if [ ! -d "$repo/.git" ]; then
    echo "⚠️  SKIP: $name (no local git repo)"
    FAILED+=("$name: no local git")
    continue
  fi

  echo "🔄 Processing: $name"
  
  # Create remote repo using gh
  if ! gh repo create "$OWNER/$name" --public --source="$repo" --remote=origin --push 2>/dev/null; then
    # If repo already exists, just push
    echo "   ℹ️  Repo already exists, pushing instead..."
    cd "$repo"
    branch=$(git branch --show-current)
    git push -u origin "$branch" 2>/dev/null || {
      echo "   ❌ FAILED: $name (push error)"
      FAILED+=("$name")
      cd - > /dev/null
      continue
    }
    cd - > /dev/null
  fi
  
  echo "   ✅ SUCCESS: $name"
  SUCCESS+=("$name")
  echo
done

echo
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    FINAL REPORT                              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo
echo "✅ Successful (${#SUCCESS[@]}):"
for s in "${SUCCESS[@]}"; do
  echo "   - $s"
done
echo

if [ ${#FAILED[@]} -gt 0 ]; then
  echo "❌ Failed (${#FAILED[@]}):"
  for f in "${FAILED[@]}"; do
    echo "   - $f"
  done
  echo
  exit 1
else
  echo "🎉 All repositories pushed successfully!"
  exit 0
fi
