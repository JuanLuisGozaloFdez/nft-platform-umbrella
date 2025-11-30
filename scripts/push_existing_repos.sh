#!/usr/bin/env bash
set -euo pipefail

BASE="/home/jlg/nft"
REPOS=(
  "nft-marketplace-backend-api"
  "nft-marketplace-smart-contracts"
  "platform-infra"
)

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║ Pushing existing repositories to GitHub                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo

for name in "${REPOS[@]}"; do
  repo="$BASE/$name"
  if [ ! -d "$repo/.git" ]; then
    echo "⚠️  SKIP: $name (no local git repo)"
    continue
  fi

  echo "🔄 Pushing: $name"
  cd "$repo"
  
  # Get current branch
  branch=$(git branch --show-current)
  echo "   Branch: $branch"
  
  # Change remote to SSH if not already
  remote_url=$(git config --get remote.origin.url || echo "")
  if [[ "$remote_url" == https://* ]]; then
    repo_name=$(basename "$name" .git)
    ssh_url="git@github.com:JuanLuisGozaloFdez/${repo_name}.git"
    echo "   Converting remote from HTTPS to SSH..."
    git remote set-url origin "$ssh_url"
  fi
  
  # Push
  if git push -u origin "$branch"; then
    echo "   ✅ SUCCESS: $name"
  else
    echo "   ❌ FAILED: $name"
  fi
  echo
  
  cd - > /dev/null
done

echo "🎉 Done pushing existing repositories!"
