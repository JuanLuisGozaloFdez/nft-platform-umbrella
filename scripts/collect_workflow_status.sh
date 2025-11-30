#!/usr/bin/env bash
set -euo pipefail

# Collect latest workflow runs status for multiple repos and summarize kube-lint/conftest results if present
# Requires: gh CLI authenticated

REPOS=(
  "JuanLuisGozaloFdez/ticketing-core-service"
  "JuanLuisGozaloFdez/wallet-assets-service"
  "JuanLuisGozaloFdez/checkin-validation-service"
  "JuanLuisGozaloFdez/users-identity-service"
  "JuanLuisGozaloFdez/payments-orders-service"
  "JuanLuisGozaloFdez/notifications-comms-service"
  "JuanLuisGozaloFdez/admin-event-ops-service"
  "JuanLuisGozaloFdez/nft-marketplace-integration"
  "JuanLuisGozaloFdez/api-gateway-bff"
  "JuanLuisGozaloFdez/admin-web-portal"
  "JuanLuisGozaloFdez/mobile-app-fans"
  "JuanLuisGozaloFdez/checkin-scanner-app"
  "JuanLuisGozaloFdez/nft-platform-umbrella"
  "JuanLuisGozaloFdez/platform-infra"
  "JuanLuisGozaloFdez/nft-marketplace-backend-api"
  "JuanLuisGozaloFdez/nft-marketplace-smart-contracts"
)

OUT="/home/jlg/nft/WORKFLOWS_TEST_REPORT.md"

echo "## 🚦 Workflow Runs Status Summary" > "$OUT"
echo "Generated: $(date -u +'%Y-%m-%d %H:%M:%S UTC')" >> "$OUT"
echo "" >> "$OUT"

echo "| Repository | Latest Run | Status | Workflow | URL |" >> "$OUT"
echo "|------------|------------|--------|----------|-----|" >> "$OUT"

for repo in "${REPOS[@]}"; do
  # Get latest run
  run_json=$(gh run list -R "$repo" --limit 1 --json databaseId,status,name,headBranch,workflowName,htmlUrl 2>/dev/null || echo "{}")
  dbid=$(echo "$run_json" | jq -r '.[0].databaseId // empty')
  status=$(echo "$run_json" | jq -r '.[0].status // empty')
  name=$(echo "$run_json" | jq -r '.[0].name // empty')
  branch=$(echo "$run_json" | jq -r '.[0].headBranch // empty')
  wf=$(echo "$run_json" | jq -r '.[0].workflowName // empty')
  url=$(echo "$run_json" | jq -r '.[0].htmlUrl // empty')
  if [[ -z "$dbid" ]]; then
    echo "| $repo | - | - | - | - |" >> "$OUT"
    continue
  fi
  echo "| $repo | $branch | $status | $wf | $url |" >> "$OUT"

  # Try to fetch logs and look for kube-linter or conftest mentions
  tmpdir=$(mktemp -d)
  if gh run download "$dbid" -R "$repo" -D "$tmpdir" 2>/dev/null; then
    kl=$(grep -R "kube-linter" -n "$tmpdir" | wc -l || true)
    cf=$(grep -R "conftest" -n "$tmpdir" | wc -l || true)
    echo "" >> "$OUT"
    echo "<details><summary>$repo: Static checks</summary>" >> "$OUT"
    if [[ "$kl" -gt 0 ]]; then
      echo "- kube-linter: detected in logs." >> "$OUT"
      # Summarize common failures
      grep -R "FAIL\|error\|warn" -n "$tmpdir" | head -n 20 >> "$OUT" || true
    else
      echo "- kube-linter: not present or skipped." >> "$OUT"
    fi
    if [[ "$cf" -gt 0 ]]; then
      echo "- conftest: detected in logs." >> "$OUT"
      grep -R "FAIL\|error\|deny" -n "$tmpdir" | head -n 20 >> "$OUT" || true
    else
      echo "- conftest: not present or skipped." >> "$OUT"
    fi
    echo "</details>" >> "$OUT"
    echo "" >> "$OUT"
  fi
  rm -rf "$tmpdir"
done

echo "\n---\n" >> "$OUT"
echo "Hint: open each URL to inspect full logs." >> "$OUT"

echo "Report written to $OUT"
