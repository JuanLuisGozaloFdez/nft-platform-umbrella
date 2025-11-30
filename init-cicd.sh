#!/bin/bash

# Script de inicialización de CI/CD para todo el sistema de ticketing NFT
# Este script configura los archivos necesarios en cada repositorio

set -e

echo "🚀 Inicializando CI/CD para Sistema de Ticketing NFT"
echo ""

REPO_ROOT="$(pwd)"
SHARED_ESLINT="${REPO_ROOT}/.eslintrc.json"
SHARED_PRETTIER="${REPO_ROOT}/.prettierrc.json"
SHARED_GITIGNORE="${REPO_ROOT}/.gitignore"

# Servicios backend
BACKEND_SERVICES=(
  "ticketing-core-service"
  "wallet-assets-service"
  "checkin-validation-service"
  "users-identity-service"
  "payments-orders-service"
  "notifications-comms-service"
  "admin-event-ops-service"
  "nft-marketplace-integration"
  "api-gateway-bff"
)

# Apps frontend
FRONTEND_APPS=(
  "mobile-app-fans"
  "admin-web-portal"
  "checkin-scanner-app"
)

# Función para copiar archivos de configuración
copy_config() {
  local repo=$1
  
  if [ ! -d "$repo" ]; then
    echo "⚠️  Repositorio no encontrado: $repo"
    return
  fi
  
  echo "📋 Configurando $repo..."
  
  # Copiar .eslintrc.json
  if [ ! -f "$repo/.eslintrc.json" ]; then
    cp "$SHARED_ESLINT" "$repo/.eslintrc.json"
    echo "  ✓ .eslintrc.json"
  fi
  
  # Copiar .prettierrc.json
  if [ ! -f "$repo/.prettierrc.json" ]; then
    cp "$SHARED_PRETTIER" "$repo/.prettierrc.json"
    echo "  ✓ .prettierrc.json"
  fi
  
  # Actualizar .gitignore (merge)
  if [ ! -f "$repo/.gitignore" ]; then
    cp "$SHARED_GITIGNORE" "$repo/.gitignore"
  else
    # Merge contenidos
    cat "$SHARED_GITIGNORE" >> "$repo/.gitignore.tmp"
    sort -u "$repo/.gitignore" "$repo/.gitignore.tmp" > "$repo/.gitignore.new"
    rm "$repo/.gitignore.tmp"
    mv "$repo/.gitignore.new" "$repo/.gitignore"
  fi
  echo "  ✓ .gitignore"
  
  # Crear directorio .github/workflows si no existe
  mkdir -p "$repo/.github/workflows"
  
  # Crear .env.example si no existe
  if [ ! -f "$repo/.env.example" ]; then
    cat > "$repo/.env.example" << 'ENV'
# Environment configuration template
NODE_ENV=development
DEBUG=false

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ticketing_db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h

# API
API_PORT=3000
API_BASE_URL=http://localhost:3000

# Blockchain
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_NETWORK=sepolia
BLOCKCHAIN_CONTRACT_ADDRESS=0x...

# IPFS
IPFS_API_URL=http://localhost:5001
IPFS_GATEWAY=https://gateway.pinata.cloud

# Payment Gateway
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# AWS
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
ENV
    echo "  ✓ .env.example"
  fi
}

# Función para crear package.json scripts
add_npm_scripts() {
  local repo=$1
  local is_backend=$2
  
  if [ ! -f "$repo/package.json" ]; then
    echo "  ⚠️  package.json no encontrado en $repo"
    return
  fi
  
  # Verificar si los scripts ya existen
  if ! grep -q '"lint"' "$repo/package.json"; then
    echo "  ℹ️  package.json requiere scripts: lint, format, test, build"
    echo "     Actualiza package.json con:"
    
    if [ "$is_backend" = "backend" ]; then
      cat << 'SCRIPTS'
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts",
    "format:check": "prettier --check src/**/*.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "tsc",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js"
SCRIPTS
    else
      cat << 'SCRIPTS'
    "lint": "eslint src/**/*.{ts,tsx}",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "format:check": "prettier --check src/**/*.{ts,tsx}",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "tsc --build",
    "dev": "next dev",
    "start": "next start"
SCRIPTS
    fi
  fi
}

echo "📦 Configurando Servicios Backend..."
echo ""
for service in "${BACKEND_SERVICES[@]}"; do
  copy_config "$service"
  add_npm_scripts "$service" "backend"
  echo ""
done

echo "📦 Configurando Apps Frontend..."
echo ""
for app in "${FRONTEND_APPS[@]}"; do
  copy_config "$app"
  add_npm_scripts "$app" "frontend"
  echo ""
done

echo "📦 Configurando Platform Infra..."
copy_config "platform-infra"
echo ""

echo "✅ Inicialización completada"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Actualiza package.json en cada repositorio con los scripts necesarios"
echo "  2. Instala dependencias: npm ci"
echo "  3. Verifica ESLint y Prettier: npm run lint && npm run format:check"
echo "  4. Ejecuta tests: npm test"
echo "  5. Build: npm run build"
echo "  6. Comitea cambios: git add . && git commit -m 'chore: setup CI/CD'"
echo ""
echo "📖 Ver CI-CD-ARCHITECTURE.md para detalles"
