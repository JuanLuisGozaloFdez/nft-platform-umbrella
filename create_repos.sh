#!/bin/bash

# Array de repositorios con sus rutas
repos=(
  "ticketing-core-service"
  "wallet-assets-service"
  "checkin-validation-service"
  "users-identity-service"
  "payments-orders-service"
  "notifications-comms-service"
  "admin-event-ops-service"
  "nft-marketplace-integration"
  "api-gateway-bff"
  "mobile-app-fans"
  "admin-web-portal"
  "checkin-scanner-app"
  "platform-infra"
)

# Crear cada repositorio con su estructura
for repo in "${repos[@]}"; do
  echo "Creando repositorio: $repo"
  mkdir -p "$repo"
  
  # Estructura común para todos
  mkdir -p "$repo/docs"
  mkdir -p "$repo/.github/workflows"
  
  # Crear .gitkeep para cada carpeta
  touch "$repo/.gitkeep"
  touch "$repo/docs/.gitkeep"
  touch "$repo/.github/.gitkeep"
  touch "$repo/.github/workflows/.gitkeep"
  
  # Archivos base
  touch "$repo/README.md"
  touch "$repo/.gitignore"
  touch "$repo/.env.example"
done

echo "Repositorios base creados exitosamente"
