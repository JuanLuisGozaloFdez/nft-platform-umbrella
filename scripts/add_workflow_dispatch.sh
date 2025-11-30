#!/usr/bin/env bash
set -euo pipefail

# Agregar workflow_dispatch trigger a todos los workflows
WORKFLOW_ADDITION='  workflow_dispatch:
    inputs:
      debug_enabled:
        type: boolean
        description: "Run the build with tmate debugging enabled"
        required: false
        default: false'

for service_dir in /home/jlg/nft/*-service /home/jlg/nft/nft-marketplace-*; do
  if [ -d "$service_dir" ]; then
    workflow_file="$service_dir/.github/workflows/backend-ci.yml"
    if [ -f "$workflow_file" ]; then
      name=$(basename "$service_dir")
      
      # Verificar si ya tiene workflow_dispatch
      if grep -q "workflow_dispatch:" "$workflow_file"; then
        echo "✅ $name: ya tiene workflow_dispatch"
      else
        echo "📝 Actualizando $name..."
        
        # Encontrar la línea "on:" y agregar workflow_dispatch después
        sed -i '/^on:$/,/^[^ ]/ {
          /^  pull_request:$/,/^  [a-z_]*:$/ {
            /^  [a-z_]*:$/ i\'"$(echo "$WORKFLOW_ADDITION" | sed 's/$/\\/')"'
          }
        }' "$workflow_file"
        
        echo "✅ $name: workflow_dispatch agregado"
      fi
    fi
  fi
done

echo ""
echo "✅ Todos los workflows actualizados con workflow_dispatch trigger"
