# Servicios Backend - Referencia Rápida

## 🚀 Puertos y Funcionalidad

| Servicio | Puerto | Status | Tests | Repo |
|----------|--------|--------|-------|------|
| API Gateway BFF | 3000 | ✅ | 6 | `api-gateway-bff` |
| Ticketing Core | 3001 | ✅ | 3 | `ticketing-core-service` |
| Users Identity | 3002 | ✅ | 6 | `users-identity-service` |
| Payments Orders | 3003 | ✅ | 17 | `payments-orders-service` |
| Notifications | 3004 | ✅ | 9 | `notifications-comms-service` |
| Wallet Assets | 3005 | ✅ | 15 | `wallet-assets-service` |
| Check-in | 3006 | ✅ | 15 | `checkin-validation-service` |
| Admin Event Ops | 3007 | ✅ | 21 | `admin-event-ops-service` |

**Total: 68 tests passing ✅**

## 📦 Clonar Todos los Servicios

```bash
#!/bin/bash
OWNER="JuanLuisGozaloFdez"
REPOS=(
  "api-gateway-bff"
  "ticketing-core-service"
  "users-identity-service"
  "payments-orders-service"
  "wallet-assets-service"
  "notifications-comms-service"
  "checkin-validation-service"
  "admin-event-ops-service"
)

for repo in "${REPOS[@]}"; do
  git clone "git@github.com:$OWNER/$repo.git"
  cd "$repo"
  npm install
  cd ..
done
```

## 🧪 Ejecutar Tests

```bash
# Individual
cd ticketing-core-service && npm test

# Todos (loop)
for dir in *-service; do
  echo "Testing $dir..."
  cd "$dir"
  npm test
  cd ..
done
```

## 🛠️ Desarrollo

```bash
# Clonar + setup
git clone git@github.com:JuanLuisGozaloFdez/ticketing-core-service.git
cd ticketing-core-service
npm install

# Modo watch
npm run dev

# Build
npm run build

# Tests con coverage
npm run test:coverage
```

## 🌐 API Gateway (Entry Point)

```bash
cd api-gateway-bff
npm run dev
# Accesible en http://localhost:3000

# Proxying
GET  /api/tickets      → ticketing-core:3001
GET  /api/users        → users-identity:3002
GET  /api/orders       → payments-orders:3003
# etc
```

## 📊 Arquitectura Multi-Tenant

Todos los servicios soportan:
- **JWT con tenant_id**: Extraído del token
- **Repository Layer**: Filtrado automático por tenant
- **RLS (Row-Level Security)**: Enforcing en PostgreSQL
- **Audit Logging**: Todas las operaciones trackeadas

## 🔑 Configuración Requerida

Cada servicio necesita un `.env`:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/nft_marketplace

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# Service-specific (según el servicio)
STRIPE_API_KEY=sk_test_...
SENDGRID_API_KEY=SG....
```

## 📈 Próximos Pasos

1. ✅ Backend services: COMPLETO (8/8)
2. ⏳ Frontend: React web + React Native mobile
3. ⏳ Blockchain: Smart contracts + testnet
4. ⏳ Database: PostgreSQL producción
5. ⏳ CI/CD: GitHub Actions operacional

---

Ver `CI_CD_ARCHITECTURE.md` para detalles técnicos completos.
