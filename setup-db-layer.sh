#!/bin/bash

# Database Layer Setup Script
# Adds PostgreSQL configuration and repository layer to backend services

SERVICES=(
  "ticketing-core-service"
  "users-identity-service"
  "api-gateway-bff"
  "payments-orders-service"
  "wallet-assets-service"
  "checkin-validation-service"
  "admin-event-ops-service"
  "notifications-comms-service"
)

PROJECT_ROOT="/home/jlg/nft"

echo "🗄️  Setting up PostgreSQL layer for all services..."
echo ""

for service in "${SERVICES[@]}"; do
  SERVICE_PATH="$PROJECT_ROOT/$service"
  
  if [ -d "$SERVICE_PATH" ]; then
    echo "📦 Processing: $service"
    
    # Create directories
    mkdir -p "$SERVICE_PATH/src/config"
    mkdir -p "$SERVICE_PATH/src/db/repositories"
    
    # Note: Actual file copying would be done by the individual setup
    echo "  ✅ Directories created"
  else
    echo "  ⚠️  Service directory not found: $SERVICE_PATH"
  fi
done

echo ""
echo "✅ Database layer setup structure ready"
echo ""
echo "Next steps:"
echo "1. Run: npm install pg --save"
echo "2. Create .env file from .env.example"
echo "3. Update services to use repositories instead of in-memory arrays"
