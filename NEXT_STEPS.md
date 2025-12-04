# NEXT_STEPS

## Summary of Recent Changes
- Backend API
  - Added `Ticket` and `CheckinAudit` models to persist ticket state and audit validations.
  - Implemented `POST /api/checkins/validate` with JWT auth to verify on-chain owner, mark tickets used, and log audits.
  - Added KPIs endpoint `GET /api/stats/kpis` returning counts and revenue.
  - Enforced RBAC middleware: `authenticate` and `authorize(['admin','organizer'])` on `/api/nft/admin/*` routes.
  - Auth login returns `{ token, role }`; added `GET /api/auth/me` for token validation and user info.
- Admin Web Portal
  - React Query hooks for events: `useEvents`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`.
  - Client-side filters on events list (text + status).
  - Dashboard pulls KPIs from `/api/stats/kpis` and shows an initial Recharts line chart.
  - `AuthProvider` hydrates token/role via `/api/auth/me`; `RequireRole` protects routes.
  - Axios interceptor with gentle toasts for 4xx/5xx; auto-redirect to `/login` on `401/403`.
  - Logout button with success toast.
   - Audits: `/api/stats/audits` with filters and `/api/stats/audits/export` server-side CSV; portal `AuditsPage` with filters/pagination and CSV export.

## Pending / TODO
- Completed: Events backend CRUD alignment and hooks connected ✅
- Completed: Role management UI with RBAC, validation y auditoría ✅
- Dashboard charts: expand with timeseries (daily check-ins, revenue trend) and localized axes formatting.
- Auditorías: UI para `RoleChangeAudit` con filtros avanzados y paginación.
   - CSV server-side ya implementado; añadir virtualización en listas grandes y control por roles.
- Secrets y entorno: configurar en CI/CD (`VITE_API_URL`, `CODECOV_TOKEN`, claves blockchain) y documentar `.env` locales.
- Tests: añadir integración para `AuthProvider`, `RequireRole`, e interceptor (401/403/4xx) y mantener cobertura ≥ 90%.

## Weekly Checklist
- [x] Backend: finalize `/admin/events` CRUD and connect to hooks.
- [x] Frontend: add KPI cards (minted, owner lookups, check-ins success) and detailed chart.
- [x] Check-in: add UI for audit list with filters/date range.
- [x] RBAC: verify route access with mixed roles and add 403 view.
- [x] CI: ensure coverage stays >= 90%; update tests for new guards and toasts.

### New Priorities (Week of 30/11/2025)
- [ ] CI/CD: configurar secrets (`VITE_API_URL`, `CODECOV_TOKEN`, claves blockchain) en GitHub Actions.
- [ ] Testing: añadir tests de integración para `AuthProvider`, `RequireRole` y el interceptor Axios (401/403/4xx).
- [ ] Dashboard: conectar gráfico a `/api/stats/checkins/daily` y ampliar KPIs.
- [ ] Auditorías: añadir UI para `RoleChangeAudit` con filtros avanzados (usuario, fecha, tipo de cambio).
- [ ] Staging: desplegar backend y portal en entorno de staging y ejecutar smoke tests.

#### How to Verify (Week of 30/11/2025)
- CI/CD: comprobar secrets presentes en `Settings → Secrets and variables → Actions` y re-ejecutar workflow (`.github/workflows/ci.yml`).
- Tests: ejecutar suite y verificar cobertura ≥ 90%.
  
   ```bash
   # Backend/Frontend (según proyecto)
   npm test -- --coverage
   ```
- Dashboard: validar gráfico con datos de `/api/stats/checkins/daily` y formatos localizados.
- Auditorías: revisar nueva vista de `RoleChangeAudit`, probar filtros y export CSV.
- Staging: abrir URL de staging (`https://staging.nft-platform.example.com`), realizar login, flujo de eventos CRUD y check-ins; revisar logs y métricas.
# NFT Ticketing Marketplace - Next Steps & Roadmap

## 🎯 Current Status
- **Backend Services**: 8/8 Complete ✅ (68 tests passing)
- **Frontend Applications**: 0/2 Pending
- **Blockchain Integration**: Not started
- **Database**: In-memory (dev mode)

---

## 📱 Phase 2: Frontend Development

### 2.1 Mobile App - Fans (`mobile-app-fans`)

**Purpose**: Native mobile application for users to browse, purchase, and manage NFT tickets

**Technology Stack**:
- React Native with Expo
- TypeScript
- Redux for state management
- React Navigation for routing
- Axios for API calls
- Web3.js for wallet integration

**Key Screens**:
1. **Authentication**
   - Login/Register screens
   - Biometric login support
   - OAuth integration (Google, Apple)

2. **Event Browsing**
   - Event listing with filters
   - Event details page
   - Map view of events
   - Search functionality

3. **Ticket Purchase**
   - Ticket selection
   - Quantity selection
   - Payment method selection
   - Order confirmation

4. **Ticket Management**
   - My Tickets screen
   - Ticket QR code display
   - Transfer ticket option
   - Ticket history

5. **Wallet Integration**
   - Import wallet
   - View NFT tickets
   - Transaction history
   - Wallet balance

6. **Profile**
   - User settings
   - Purchase history
   - Saved events
   - Notification preferences

**Implementation Steps**:
```bash
# 1. Create project structure
mkdir -p /home/jlg/nft/mobile-app-fans
cd /home/jlg/nft/mobile-app-fans
npx create-expo-app .

# 2. Install dependencies
npm install typescript @types/react-native redux @react-navigation/native axios web3

# 3. Create folder structure
mkdir -p src/{screens,components,services,reducers,types,utils}

# 4. Set up TypeScript
tsc --init

# 5. Implement screens and components
# - Create authentication flow
# - Event browsing screens
# - Ticket purchase flow
# - Wallet integration
# - QR code display

# 6. Add API integration
# - Configure axios with API Gateway endpoint
# - Create service layer for each backend service
# - Handle error states

# 7. Testing
# - Jest for unit tests
# - React Native Testing Library for component tests
```

### 2.2 Admin Web Portal (`admin-web-portal`)

**Purpose**: Web application for event organizers and administrators

**Technology Stack**:
- React 18 with TypeScript
- Vite for bundling
- TailwindCSS for styling
- React Query for data fetching
- Chart.js/Recharts for analytics
- React Hook Form for forms

**Key Pages**:
1. **Dashboard**
   - KPI cards (revenue, attendance, tickets sold)
   - Real-time charts
   - Upcoming events
   - Recent sales

2. **Events Management**
   - Create/Edit events
   - Event list with filters
   - Event status management
   - Capacity planning

3. **Analytics & Reports**
   - Sales analytics
   - Attendance tracking
   - Revenue by ticket type
   - Conversion funnel
   - User demographics
   - Custom report generator

4. **Ticket Management**
   - Bulk ticket creation
   - QR code generation
   - Ticket inventory tracking
   - Ticket status monitoring

5. **Check-ins**
   - Live check-in dashboard
   - Attendance statistics
   - Entry gate management
   - Real-time capacity alerts

6. **Payments & Refunds**
   - Transaction history
   - Refund management
   - Payment method tracking
   - Revenue reconciliation

7. **Settings & Team**
   - User management
   - Role-based access control
   - API key management
   - Event templates

**Implementation Steps**:
```bash
# 1. Create Vite project
npm create vite@latest admin-web-portal -- --template react-ts
cd admin-web-portal

# 2. Install dependencies
npm install tailwindcss react-query recharts react-hook-form axios

# 3. Create folder structure
mkdir -p src/{components,pages,services,hooks,types,utils,layouts}

# 4. Set up Tailwind CSS
npx tailwindcss init -p

# 5. Implement pages
# - Dashboard with KPIs
# - Event management pages
# - Analytics dashboard
# - Reports generator

# 6. Create API layer
# - Service integration with gateway
# - Data fetching with React Query
# - Error handling

# 7. Testing & Deployment
# - Vitest for unit tests
# - Cypress for E2E tests
# - Build optimization
```

**Progress & Pending (MVP updates)**
- Done:
   - Base app (Vite + TS + Tailwind), routing y layout.
   - Selector de idioma (ES/EN) con i18n ligero y `react-datepicker` localizado.
   - Formulario de eventos con validación básica y datepicker avanzado.
   - Web3 admin: formulario para mintear NFT y consulta de propietario.
   - Página de Check-ins con validación de entrada (owner on-chain + expected owner opcional).
   - Tests de i18n y formatters (Vitest + Testing Library); subida de cobertura con Codecov.
- Next:
   - Events CRUD hooks: `useEvents`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent` totalmente conectados.
   - Events UI: filtros y feedback de éxito/error; paginación si aplica.
   - Dashboard KPIs: tarjetas y gráfico básico (Recharts), localización de formatos.
   - Ajustar persistencia de estado del ticket a modelo real (reemplazar placeholder `Transaction`).
   - Añadir protección de rutas con estado de auth real y roles.

---

## ⛓️ Phase 3: Blockchain Integration

### 3.1 Smart Contracts (`nft-marketplace-smart-contracts` - existing)

**Current Status**: Already set up with Diamond pattern

**To Complete**:
1. Deploy NFT contract for ticket minting
2. Deploy Marketplace contract
3. Configure contract addresses in services
4. Write Web3 integration layer

**Key Contracts**:
- `NFT.sol` - ERC721 ticket contract
- `Marketplace.sol` - Secondary marketplace
- `Diamond.sol` - Proxy pattern for upgradeable contracts

### 3.2 Backend Web3 Integration

**Services to Update**:

#### Payments Orders Service
```typescript
// src/services/blockchainService.ts
- connectToBlockchain()
- mintNFT(to, ticketId, metadata)
- verifyMintTransaction(hash)
- getTicketOwner(tokenId)
- transferTicket(from, to, tokenId)
```

#### Wallet Assets Service
```typescript
// src/services/web3Service.ts
- getWalletBalance(address)
- getWalletNFTs(address)
- validateNFTOwnership(address, tokenId)
- getTokenMetadata(contractAddress, tokenId)
```

#### Check-in Validation Service
```typescript
// src/services/blockchainValidation.ts
- verifyTicketNFT(tokenId, contractAddress)
- validateTicketOwnership(userAddress, tokenId)
- recordCheckInOnBlockchain(tokenId, eventId)
```

**Progress & Pending (Web3 layer)**
- Done:
   - Backend `nft-marketplace-backend-api`: métodos Web3 (`mintNFT`, `getTicketOwner`, `verifyMintTransaction`, `transferTicket`).
   - Endpoints admin: `POST /api/nft/admin/mint`, `GET /api/nft/admin/owner/:tokenId` (roles admin/organizer).
   - Check-ins: `POST /api/checkins/validate` integrando owner on-chain y marcado `used` (placeholder).
- Next:
   - Conectar marcado `used` al modelo `tickets` real y auditoría de check-in.
   - Añadir escaneo QR en Admin Portal para capturar `tokenId` y registro de eventos.

### 3.3 Frontend Web3 Integration

**Mobile App**:
```typescript
// src/services/walletService.ts
- connectMetaMask()
- connectWalletConnect()
- getConnectedWallet()
- signTransaction(tx)
- sendTransaction(tx)
```

**Admin Portal**:
```typescript
// src/services/smartContractService.ts
- deployTicketContract(name, symbol, supply)
- configureMarketplace()
- setRoyalties()
- setMintingRules()
```

---

## 🗄️ Phase 4: Database Integration

### 4.1 PostgreSQL Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role ENUM('user', 'admin', 'organizer'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  total_capacity INT,
  tickets_sold INT DEFAULT 0,
  revenue DECIMAL(18, 2) DEFAULT 0,
  status ENUM('draft', 'active', 'live', 'ended', 'cancelled'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  nft_token_id VARCHAR(255),
  ticket_type VARCHAR(100),
  price DECIMAL(18, 2),
  status ENUM('available', 'sold', 'used', 'refunded'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  ticket_id UUID REFERENCES tickets(id),
  quantity INT,
  total_amount DECIMAL(18, 2),
  status ENUM('pending', 'completed', 'failed', 'cancelled'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  address VARCHAR(255),
  balance DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE check_ins (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  user_id UUID REFERENCES users(id),
  check_in_time TIMESTAMP,
  location VARCHAR(255),
  scanned_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type ENUM('email', 'sms', 'webhook'),
  subject VARCHAR(255),
  message TEXT,
  status ENUM('pending', 'sent', 'failed'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 Service Updates for Database

Each service needs:
1. PostgreSQL connection pool (node-postgres)
2. Migration scripts (db-migrate or Liquibase)
3. Type-safe queries (Prisma or TypeORM)
4. Connection pooling (pgBouncer)

---

## 📊 Implementation Timeline

```
Phase 2 (Weeks 1-3): Frontend Development
├─ Mobile App (React Native)
│  ├─ Week 1: Project setup, authentication screens
│  ├─ Week 2: Event browsing, ticket purchase
│  └─ Week 3: Wallet integration, QR display
└─ Admin Portal (React)
   ├─ Week 1: Dashboard, event management
   ├─ Week 2: Analytics, reports
   └─ Week 3: Team management, settings

Phase 3 (Weeks 4-5): Blockchain Integration
├─ Smart contract configuration
├─ Web3 service layer
├─ NFT minting integration
└─ Testing on testnet

Phase 4 (Week 6): Database Migration
├─ PostgreSQL schema setup
├─ Migration scripts
├─ Data validation
└─ Performance optimization
```

---

## 🔗 Environment Variables Required

### Frontend (Mobile App)
```
REACT_NATIVE_API_URL=http://api-gateway:3000
REACT_NATIVE_WEB3_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
REACT_NATIVE_CONTRACT_ADDRESS=0x...
REACT_NATIVE_MARKETPLACE_ADDRESS=0x...
```

### Frontend (Admin Portal)
```
VITE_API_URL=http://api-gateway:3000
VITE_ADMIN_SECRET=your-admin-secret
VITE_CHART_API_KEY=your-chart-key
```

### Backend (Database)
```
DATABASE_URL=postgresql://user:password@localhost:5432/nft_ticketing
DATABASE_POOL_SIZE=20
DATABASE_POOL_IDLE_TIMEOUT=30000
```

### Blockchain
```
INFURA_API_KEY=your-key
ALCHEMY_API_KEY=your-key
PRIVATE_KEY=your-deployer-key
CONTRACT_ADDRESS=0x...
MARKETPLACE_ADDRESS=0x...
```

---

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Storybook for visual regression
- **E2E Tests**: Cypress for critical flows
- **Performance**: Lighthouse CI

### Backend Testing
- Already implemented: 68 tests passing ✅
- Add: Integration tests with PostgreSQL
- Add: Blockchain testnet tests
- Add: Load testing with k6

---

## 🚀 Deployment Strategy

### Development
```
local-dev → GitHub repo → GitHub Actions CI/CD → ghcr.io
```

### Staging
```
Main branch → Staging environment → Manual testing → Approvals
```

### Production
```
Production branch → Blue-Green deployment → Health checks → Traffic migration
```

---

## 📋 Pre-deployment Checklist

- [ ] All 8 backend services tested and verified
- [ ] Frontend apps built and tested
- [ ] Blockchain contracts audited
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificates generated
- [ ] Load testing completed
- [ ] Security scanning passed
- [ ] Documentation updated
- [ ] Disaster recovery plan in place
- [ ] Monitoring and alerts configured
- [ ] Rollback procedures documented

---

## 💡 Next Immediate Steps

1. **Start Mobile App Development** (3-4 days)
   - Create React Native project
   - Set up authentication flow
   - Implement event listing screen
   - Connect to API Gateway

2. **Start Admin Portal Development** (3-4 days)
   - Create React + Vite project
   - Build dashboard layout
   - Implement event management pages
   - Set up analytics dashboard

3. **Configure Blockchain** (2 days)
   - Deploy test contracts
   - Generate contract ABIs
   - Update backend services with contract addresses
   - Test minting flow

4. **Set up PostgreSQL** (1-2 days)
   - Create schema
   - Set up connection pooling
   - Write migration scripts
   - Update services with ORM

---

## 🎯 Success Metrics

- [ ] 90%+ test coverage across all services
- [ ] <100ms API response time (p95)
- [ ] <2s frontend page load time
- [ ] 99.9% service availability
- [ ] Zero security vulnerabilities
- [ ] Complete end-to-end flow working

---

**Status**: Ready for Phase 2! 🚀
**Questions**: Review individual service README files or check CI/CD workflows

---

## ✅ Weekly Checklist (MVP follow-up)

- [ ] Admin Portal: completar hooks CRUD de eventos (list/create/update/delete)
- [ ] Admin Portal: filtros en listado de eventos y feedback de errores
- [ ] Admin Portal: KPIs y gráfico básico con Recharts (formato localizado)
- [ ] Web3: conectar marcado `used` al modelo `tickets` real y auditoría de check-in
- [ ] Web3: verificar owner on-chain en flujos relevantes (check-in y soporte)
- [ ] CI: asegurar secrets (`VITE_*`, `CODECOV_TOKEN`) y cobertura ≥ 90%
- [ ] Auth/RBAC: proteger rutas del portal con roles (admin/organizer)
