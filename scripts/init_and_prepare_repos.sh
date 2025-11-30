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

echo "Preparing repositories under $BASE"

for name in "${REPOS[@]}"; do
  repo="$BASE/$name"
  if [ ! -d "$repo" ]; then
    echo "- Skipping $name: directory not found"
    continue
  fi

  if [ -d "$repo/.git" ]; then
    echo "- Skipping $name: already a git repo"
    continue
  fi

  echo "- Initializing $name"
  # Create a sensible .gitignore
  cat > "$repo/.gitignore" <<'EOF'
node_modules/
dist/
.env
.env.local
.DS_Store
.idea/
.vscode/
coverage/
npm-debug.log
yarn-error.log
logs/
*.log
EOF

  (cd "$repo" && \
    git init && \
    git add .gitignore || true && \
    git add -A || true && \
    git commit -m "chore: initial commit" || echo "No changes to commit in $name" )

  # ensure branch main
  (cd "$repo" && git branch -M main 2>/dev/null || true)

  sshurl="git@github.com:JuanLuisGozaloFdez/${name}.git"
  (cd "$repo" && git remote add origin "$sshurl" 2>/dev/null || git remote set-url origin "$sshurl")

  echo "  -> Local repo initialized and origin set to $sshurl"
  echo "     To create the remote repository and push, either use GitHub UI or install 'gh' and run:"
  echo "       cd $repo && gh repo create JuanLuisGozaloFdez/${name} --public --source=. --remote=origin --push"
  echo "     Or create the repo on GitHub and then push:\n       cd $repo && git push -u origin main"
done

echo "All done. Review messages above for any skips or errors."
