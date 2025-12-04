# NFT Marketplace Platform

🎫 Plataforma completa de marketplace de NFT con arquitectura de microservicios, integración blockchain y soporte multi-tenant.

## 📋 Descripción General

Plataforma empresarial para la creación, venta y gestión de NFT (Non-Fungible Tokens) con:
- ✅ 8 microservicios backend independientes
- ✅ API Gateway BFF (Backend for Frontend)
- ✅ Sistema de ticketing integrado
- ✅ Billetera digital y gestión de activos
- ✅ Pagos y órdenes
- ✅ Sistema de notificaciones multi-canal
- ✅ Validación y check-in
- ✅ Arquitectura multi-tenant SaaS

## 🏗️ Arquitectura

### Servicios Backend (Node.js + TypeScript)

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **API Gateway BFF** | 3000 | Entry point, rate limiting, CORS, proxy |
| **Users Identity** | 3002 | Autenticación JWT, gestión de usuarios |
| **Ticketing Core** | 3001 | CRUD de tickets NFT, metadatos |
| **Payments Orders** | 3003 | Órdenes, pagos, minting de NFT |
| **Wallet Assets** | 3005 | Gestión de wallets, activos, transacciones |
| **Notifications** | 3004 | Email, SMS, webhooks |
| **Check-in Validation** | 3006 | QR validation, verificación asistencia |
| **Admin Event Ops** | 3007 | Eventos, analytics, reportes |

### Repositorios

- 📦 `nft-marketplace-backend-api` - Monorepo inicial (deprecated, split into services)
- ⛓️ `nft-marketplace-smart-contracts` - Smart contracts Solidity + Hardhat
- 🛠️ `platform-infra` - Infrastructure as Code, CI/CD, Docker

### Servicios Independientes

Cada servicio tiene su propio repositorio:
- `ticketing-core-service`
- `users-identity-service`
- `api-gateway-bff`
- `payments-orders-service`
- `wallet-assets-service`
- `notifications-comms-service`
- `checkin-validation-service`
- `admin-event-ops-service`

## 🗄️ Base de Datos

**PostgreSQL 15** con:
- Multi-tenancy: Schema-per-tenant shared instance
- Row-Level Security (RLS) para tenant isolation
- Audit logging automático
- Quotas y usage tracking

### Esquema Multi-Tenant

```
Shared Tables:
  - tenants (org/company)
  - users (con tenant_id)
  - roles, permissions
  - audit_logs
  - tenant_quotas

Per-Tenant Tables:
  - orders
  - payments
  - nft_mint_transactions
  (todas con tenant_id FK)
```

## 🔐 Seguridad

- **Autenticación**: JWT tokens con tenant_id, role, permissions
- **RBAC**: Role-Based Access Control por tenant
- **Tenant Isolation**: 
  - JWT validation (Layer 1)
  - Repository filtering (Layer 2)
  - PostgreSQL RLS (Layer 3)
  - Audit logging (Layer 4)
- **SSH Keys**: Configuradas para git operations
- **Tokens**: Se almacenan en `.env`, nunca en repo

## 🚀 Inicio Rápido

### Requisitos
- Node.js 20+
- PostgreSQL 15+
- Git + SSH keys configuradas
- GitHub CLI (`gh`) para crear repos

### Instalación Local

```bash
# Clonar todos los servicios
git clone git@github.com:JuanLuisGozaloFdez/ticketing-core-service.git
git clone git@github.com:JuanLuisGozaloFdez/users-identity-service.git
git clone git@github.com:JuanLuisGozaloFdez/api-gateway-bff.git
# ... resto de servicios

# Cada servicio
cd ticketing-core-service
npm install
npm run dev
# Servidor corre en http://localhost:3001
```

### Variables de Entorno (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nft_marketplace

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h

# API Keys
STRIPE_API_KEY=sk_test_xxxxx
SENDGRID_API_KEY=SG.xxxxx

# GitHub (solo si usas gh CLI)
GITHUB_TOKEN=ghp_xxxxx
```

### Tests

```bash
# Unit tests
npm test

# Coverage
npm run test:coverage

# Expected: 68+ tests passing across all services
```

## 📊 CI/CD Pipeline

Cada servicio tiene su propio workflow en `.github/workflows/backend-ci.yml`:

1. **Trigger**: Push a `main`, PR, manual dispatch
2. **Tests**: Jest con coverage
3. **Lint**: ESLint + Prettier
4. **Build**: TypeScript compilation
5. **Artifacts**: Publish coverage reports

**Total**: 14 workflows operacionales (8 backend + 3 frontend + 2 infra + 1 umbrella)

### Manual workflow dispatch (umbrella)

Para lanzar manualmente el workflow del umbrella `reports-scheduler.yml` y verificar su estado:

```bash
# Definir repo y workflow
REPO="JuanLuisGozaloFdez/nft-platform-umbrella"
WF="reports-scheduler.yml"

# Autenticación con GitHub CLI (si no está configurado)
echo "$GH_TOKEN" | gh auth login --with-token

# Disparar el workflow en la rama main
gh workflow run "$WF" -R "$REPO" --ref main

# Esperar unos segundos y ver el último run
sleep 5
gh run list -R "$REPO" --workflow "$WF" --limit 1 --json databaseId,htmlUrl,status,conclusion \
  | jq -r '.[0] | "URL: " + (.htmlUrl // "-") + "\nStatus: " + (.status // "-") + "\nConclusion: " + (.conclusion // "-")'

# Opcional: ver logs del último run
RUN_ID=$(gh run list -R "$REPO" --workflow "$WF" --limit 1 --json databaseId | jq -r '.[0].databaseId')
gh run watch -R "$REPO" "$RUN_ID" --interval 5
gh run view -R "$REPO" "$RUN_ID" --log
```

Notas:
- Asegúrate de tener `jq` instalado (`sudo apt-get install -y jq`).
- Si tu workflow tiene otro nombre/archivo, ajusta `WF` según corresponda.

## 📁 Estructura de Carpetas

```
nft/
├── ticketing-core-service/          # Servicio de tickets
├── users-identity-service/          # Autenticación
├── api-gateway-bff/                 # Gateway
├── payments-orders-service/         # Pagos + Órdenes
├── wallet-assets-service/           # Wallets
├── notifications-comms-service/     # Notificaciones
├── checkin-validation-service/      # Check-in
├── admin-event-ops-service/         # Admin
├── nft-marketplace-backend-api/     # Legacy monorepo
├── nft-marketplace-smart-contracts/ # Smart contracts
├── platform-infra/                  # Infrastructure
├── scripts/                         # Utility scripts
│   ├── init_and_prepare_repos.sh
│   ├── create_and_push_all_repos.sh
│   └── push_existing_repos.sh
└── docs/                            # Documentation
    └── CI_CD_ARCHITECTURE.md        # This file
```

## 🔗 Enlaces Útiles

- **GitHub Org**: https://github.com/JuanLuisGozaloFdez
- **Repos**:
  - Backend: https://github.com/JuanLuisGozaloFdez?tab=repositories
  - Smart Contracts: https://github.com/JuanLuisGozaloFdez/nft-marketplace-smart-contracts
  - Infrastructure: https://github.com/JuanLuisGozaloFdez/platform-infra

## 📝 Próximos Pasos

- [ ] Frontend: React web portal + React Native mobile app
- [ ] Blockchain: Testnet deployment + smart contract integration
- [ ] Database: PostgreSQL production setup + migrations
- [ ] Monitoring: ELK stack, Prometheus metrics
- [ ] Kubernetes: k8s deployment manifests + Helm charts

## 📄 Licencia

MIT

---

**Documentación**: Ver `CI_CD_ARCHITECTURE.md` para detalles técnicos completos de la arquitectura CI/CD.
