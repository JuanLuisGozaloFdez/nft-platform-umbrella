# 📚 Database Layer Documentation

## Overview

The project now includes a complete PostgreSQL integration layer with the following components:

- **Database Configuration** (`src/config/database.ts`)
- **Repository Pattern** (`src/db/repositories/`)
- **Schema Definitions** (`src/db/schema.sql`)
- **Fallback to In-Memory Storage** for development/testing

## Architecture

```
Application Layer (Controllers)
         ↓
Service Layer (ordersService, etc.)
         ↓
Repository Layer (OrdersRepository, PaymentsRepository)
         ↓
Database Layer (PostgreSQL or In-Memory)
```

## Configuration

### Environment Variables

Create a `.env` file in the service root directory:

```env
# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nft_marketplace_dev
USE_MEMORY=false

# Service
PORT=3003
NODE_ENV=development

# Credentials
STRIPE_SECRET_KEY=sk_test_xxxxx
JWT_SECRET=your_secret_key
```

### Fallback Modes

| Environment | Behavior | Use Case |
|-------------|----------|----------|
| `DATABASE_URL` set | Uses PostgreSQL | Production, Testing |
| `DATABASE_URL` unset | In-memory storage | Local development |
| `USE_MEMORY=true` | Forces in-memory | Testing |

## Usage Examples

### Payments Orders Service

#### Old Approach (In-Memory)

```typescript
// src/services/ordersService.ts
const orders: Order[] = [];

export const createOrder = (userId: string, ...): Order => {
  const order = { id: uuidv4(), ... };
  orders.push(order);
  return order;
};
```

#### New Approach (Database)

```typescript
// src/services/ordersService.ts
import { ordersRepository } from '../db/repositories';

export const createOrder = async (userId: string, ...): Promise<Order> => {
  const order = await ordersRepository.create({
    userId,
    ticketId,
    quantity,
    totalAmount,
    status: 'pending',
    nftTokenIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return order;
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  return await ordersRepository.findById(orderId);
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  return await ordersRepository.findByUserId(userId);
};
```

### Controller Usage

```typescript
// src/controllers/ordersController.ts
export const createOrderHandler = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(
      req.body.userId,
      req.body.ticketId,
      req.body.quantity,
      req.body.totalAmount
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Repository Methods

### BaseRepository

All repositories inherit from `BaseRepository<T>` providing:

```typescript
// Find operations
async findAll(): Promise<T[]>
async findById(id: string): Promise<T | null>
async find(whereClause: string, values?: any[]): Promise<T[]>

// Count
async count(): Promise<number>

// Create/Update/Delete
async create(data: T): Promise<T>
async update(id: string, data: Partial<T>): Promise<T | null>
async delete(id: string): Promise<boolean>

// Testing
getMemoryStore(): T[]
clearMemoryStore(): void
```

### OrdersRepository Specific

```typescript
// Custom queries
async findByUserId(userId: string): Promise<Order[]>
async findByStatus(status: Order['status']): Promise<Order[]>
async addNFTToken(orderId: string, tokenId: string): Promise<Order | null>
```

### PaymentsRepository Specific

```typescript
async findByOrderId(orderId: string): Promise<Payment | null>
async findByUserId(userId: string): Promise<Payment[]>
async findByStripeId(stripePaymentId: string): Promise<Payment | null>
```

### NFTTransactionsRepository Specific

```typescript
async findByOrderId(orderId: string): Promise<NFTMintTransaction[]>
async findByTransactionHash(hash: string): Promise<NFTMintTransaction | null>
async findPending(): Promise<NFTMintTransaction[]>
```

## Database Schema

### Orders Table

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    ticket_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    nft_token_ids TEXT[] DEFAULT '{}',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);
```

### Payments Table

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    user_id UUID NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    stripe_payment_id VARCHAR(255),
    metadata JSONB
);
```

### NFT Mint Transactions Table

```sql
CREATE TABLE nft_mint_transactions (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    user_id UUID NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255),
    blockchain VARCHAR(50),
    transaction_hash VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    metadata JSONB
);
```

## Setup Steps

### 1. Install Dependencies

```bash
npm install pg --save
npm install --save-dev @types/pg
```

### 2. Create Environment File

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Set Up PostgreSQL Database

```bash
# Create database
createdb nft_marketplace_dev

# Or using Docker
docker run -d \
  --name postgres-nft \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nft_marketplace_dev \
  -p 5432:5432 \
  postgres:15-alpine
```

### 4. Initialize Schema

The schema is automatically initialized on service startup via `initializeDatabase()`.

### 5. Update Services

Refactor services to use repositories instead of in-memory arrays:

```bash
# Before
const orders: Order[] = [];

# After
import { ordersRepository } from '../db/repositories';
// Now use ordersRepository.create(), findById(), etc.
```

## Testing

### In-Memory Mode Testing

```typescript
import { ordersRepository } from '../db/repositories';

describe('Orders Service', () => {
  beforeEach(() => {
    ordersRepository.clearMemoryStore();
  });

  it('should create and retrieve order', async () => {
    const order = await ordersRepository.create({...});
    const found = await ordersRepository.findById(order.id);
    expect(found).toEqual(order);
  });
});
```

### Testing with Real Database

```typescript
// Set USE_MEMORY=false in .env during tests
// Tests will use actual PostgreSQL
```

## Migration Path

### Phase 1: Add Database Configuration ✅
- ✅ Create `config/database.ts`
- ✅ Support both PostgreSQL and in-memory modes
- ✅ Add pg dependency

### Phase 2: Create Repository Layer
- ✅ `BaseRepository<T>` abstract class
- ✅ Service-specific repositories
- ✅ Database schema

### Phase 3: Refactor Services
- ⏳ Update `ordersService.ts` to use repositories
- ⏳ Update `paymentsService.ts` to use repositories
- ⏳ Update `nftService.ts` to use repositories

### Phase 4: Update Tests
- ⏳ Update test suites to work with both modes
- ⏳ Add database-specific integration tests

## Connection Pool Configuration

Default settings in `config/database.ts`:

```typescript
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,              // Maximum connections
  idleTimeoutMillis: 30000,  // 30 seconds
  connectionTimeoutMillis: 2000, // 2 seconds
});
```

Adjust these for your needs:
- Increase `max` for high-concurrency environments
- Decrease `idleTimeoutMillis` to release connections faster

## Health Check

```bash
# Check database status
curl http://localhost:3003/health
# Response: { status: 'ok', service: '...', database: 'postgres' | 'memory' }
```

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running:
```bash
docker ps | grep postgres
# or
psql postgres
```

### Schema Not Initializing

**Solution**: Check file permissions and ensure `src/db/schema.sql` exists:
```bash
ls -la src/db/schema.sql
```

### Out of Connections

```
Error: Client did not return in time
```

**Solution**: Increase pool size or check for connection leaks:
```typescript
const pool = new Pool({ max: 50, ... });
```

## Next Steps

1. ✅ Database configuration created
2. ✅ Repository layer implemented
3. ⏳ Update all services to use repositories
4. ⏳ Add PostgreSQL to GitHub Actions CI/CD
5. ⏳ Create database migration system
6. ⏳ Add connection pooling monitoring

## References

- [pg npm package](https://www.npmjs.com/package/pg)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
