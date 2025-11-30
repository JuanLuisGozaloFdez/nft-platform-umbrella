# Arquitectura CI/CD - Sistema de Ticketing NFT

## Visión General

La estrategia de CI/CD implementa un pipeline paralelo de 5 fases que valida, prueba, construye y despliega todos los componentes del sistema de ticketing NFT.

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIGGER                                   │
│  Push (main/develop) | PR | Schedule | Manual Dispatch       │
└────────────────┬────────────────────────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
     ▼                       ▼
┌─────────────┐         ┌──────────────┐
│ Code Push   │         │ Scheduled    │
│ to GitHub   │         │ Security     │
│             │         │ Scan Daily   │
└──────┬──────┘         └──────┬───────┘
       │                       │
       └───────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  PHASE 1: VALIDATE   │ (Paralela)
        │  (5-10 min)          │
        ├──────────────────────┤
        │ ✓ Code Quality       │
        │ ✓ Frontend Quality   │
        │ ✓ Infra Validation   │
        │ ✓ Security Checks    │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   PHASE 2: TESTS     │ (Paralela)
        │  (15-20 min)         │
        ├──────────────────────┤
        │ ✓ Backend Unit Tests │
        │ ✓ Backend Integ Test │
        │ ✓ Frontend Unit Test │
        │ ✓ Frontend Integ Test│
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   PHASE 3: BUILD     │ (Paralela)
        │  (10-15 min)         │
        ├──────────────────────┤
        │ ✓ Build Services (9) │
        │ ✓ Build Apps (3)     │
        │ ✓ Artifacts Upload   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  PHASE 4: DOCKER     │ (Push only)
        │  (15-20 min)         │
        ├──────────────────────┤
        │ ✓ Build Images       │
        │ ✓ Push to Registry   │
        │ ✓ Tag: branch/sem    │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼ (main branch)       ▼ (PR)
    ┌─────────────┐       ┌──────────────┐
    │PHASE 5: DEP │       │ NOTIFICATIONS│
    │   LOY       │       └──────────────┘
    ├─────────────┤
    │ ✓ AWS/EKS   │
    │ ✓ K8s Apply │
    │ ✓ Rollout   │
    │ ✓ Verify    │
    └──────┬──────┘
           │
           ▼
    ┌────────────────┐
    │ NOTIFICATIONS  │
    │ & SUMMARY      │
    └────────────────┘
```

## Componentes Principales

### 1. Platform Umbrella Workflow
**Archivo**: `.github/workflows/platform-umbrella.yml`

Workflow maestro que:
- Orquesta todos los jobs en paralelo
- Gestiona dependencias entre fases
- Envía notificaciones
- Genera reportes

**Triggers**:
- Push a main/develop
- Pull Requests a main/develop
- Schedule diario (seguridad)
- Dispatch manual

### 2. Workflows Individuales

#### Backend CI/CD
**Archivo**: `.github/workflows/backend-ci.yml`

Aplicado a:
- ticketing-core-service
- wallet-assets-service
- checkin-validation-service
- users-identity-service
- payments-orders-service
- notifications-comms-service
- admin-event-ops-service
- nft-marketplace-integration
- api-gateway-bff

**Jobs**:
```yaml
lint:
  - ESLint
  - Output caching

test:
  - PostgreSQL + Redis services
  - Coverage reports
  - Codecov upload

build:
  - TypeScript compilation
  - Artifact upload

build-image:
  - Docker build multi-stage
  - Push a GitHub Container Registry
  - Cache optimization

security-scan:
  - npm audit
  - Trivy filesystem scan
  - SARIF output
```

#### Frontend CI/CD
**Archivo**: `.github/workflows/frontend-ci.yml`

Aplicado a:
- mobile-app-fans
- admin-web-portal
- checkin-scanner-app

**Jobs**:
```yaml
lint:
  - ESLint
  - Prettier format check

test:
  - Jest tests
  - Coverage reports

build:
  - Bundle build
  - Artifact upload

security-scan:
  - npm audit
  - Trivy scan
```

#### Infrastructure CI/CD
**Archivo**: `.github/workflows/infra-ci.yml`

**Jobs**:
```yaml
validate-terraform:
  - Terraform init/validate
  - Format check
  - Plan preview en PR

tflint:
  - Linting Terraform

validate-k8s:
  - kubectl dry-run
  - Kube-linter

security-scan:
  - Checkov Terraform
  - Checkov K8s

plan-terraform:
  - Plan output en PR comments
```

## Paralelización y Rendimiento

### Estrategia de Paralelo

```
PHASE 1 (Validation - Paralela):
├─ 9 Backend lints (batch de 3)
├─ 3 Frontend lints (batch de 3)
├─ Infra validation
└─ Security checks
   Total: ~10 minutos

PHASE 2 (Tests - Paralela):
├─ 9 Backend tests (batch de 2)
├─ 3 Frontend tests (batch de 2)
   Total: ~20 minutos

PHASE 3 (Build - Paralela):
├─ 9 Backend builds (batch de 3)
├─ 3 Frontend builds (batch de 3)
   Total: ~15 minutos

PHASE 4 (Docker - Paralela):
├─ 9 Docker builds (batch de 3)
   Total: ~20 minutos

PHASE 5 (Deploy - Secuencial):
└─ Deploy a K8s
   Total: ~5 minutos

=== TOTAL ESTIMADO: ~60 minutos ===
```

### Recursos

- **Runners**: GitHub-hosted Ubuntu Latest
- **Concurrencia máxima**: 3 jobs en paralelo
- **Almacenamiento artefactos**: 1 día
- **Caché**: 5GB

## Gestión de Secretos

### Secretos Requeridos (Repository Settings)

```
GITHUB_TOKEN
  ├─ Automático (creado por GitHub)
  └─ Permisos: packages:write, contents:read

AWS_ACCESS_KEY_ID
  ├─ Creado en AWS IAM
  └─ Permisos: EKS, ECR, CloudWatch

AWS_SECRET_ACCESS_KEY
  ├─ Pair de AWS_ACCESS_KEY_ID
  └─ Mantener confidencial

SLACK_WEBHOOK_URL
  ├─ URL de webhook de Slack
  └─ Opcional, para notificaciones
```

### Variables de Entorno

```
REGISTRY: ghcr.io
NODE_ENV: production/test
DATABASE_URL: postgresql://...
REDIS_URL: redis://...
```

## Gestión de Artefactos

### Almacenamiento

```
Build Artifacts:
├─ dist/ (backend)
├─ dist/ (frontend)
└─ Retention: 1 día

Docker Images:
├─ ghcr.io/ticketing-system/service:branch-sha
├─ ghcr.io/ticketing-system/service:branch
├─ ghcr.io/ticketing-system/service:v1.0.0
└─ Retention: indefinido

Coverage Reports:
├─ Codecov upload
├─ GitHub artifacts (1 día)
└─ Retention: 30 días (Codecov)
```

## Notificaciones

### Slack Integration

```json
{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "✅ Platform CI/CD Pipeline\nStatus: success\nBranch: main\nCommit: abc123"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": "View Workflow",
          "url": "https://github.com/..."
        }
      ]
    }
  ]
}
```

### GitHub Status Checks

- ✅ Lint passed
- ✅ Tests passed
- ✅ Build succeeded
- ✅ Security scan passed
- ✅ Deployment successful

## Despliegue Automático

### Condiciones

```
main branch:
├─ Todos los tests ✅
├─ Build exitoso ✅
├─ Security scan ✅
└─ Deploy automático a PROD

develop branch:
├─ Todos los tests ✅
├─ Build exitoso ✅
└─ Espera aprobación manual (staging)

Pull Request:
├─ Todos los tests ✅
├─ Build exitoso ✅
├─ No deploy automático
└─ Status checks muestran resultado
```

### Etapas de Despliegue

```
Dev (automático):
└─ Cada push a branch de feature

Staging (manual):
├─ Deploy desde develop
├─ Requiere aprobación
└─ Validar cambios

Production (automático):
├─ Deploy desde main
├─ Zero-downtime rollout
├─ Canary deployment (opcional)
└─ Health checks automáticos
```

## Seguridad

### Scans Implementados

1. **npm audit**
   - Vulnerabilidades de dependencias
   - Nivel: moderate

2. **Trivy**
   - Escaneo de filesystems
   - Imágenes Docker
   - Formato SARIF para GitHub

3. **Checkov**
   - Validación Terraform
   - Validación Kubernetes
   - Compliance checks

4. **CodeQL**
   - Análisis estático
   - Tipos de seguridad conocidos
   - Dashboard en GitHub Security

## Monitoreo

### Dashboards

```
GitHub Actions:
├─ Workflow runs history
├─ Job logs
└─ Artifact downloads

GitHub Security:
├─ SARIF uploads
├─ Vulnerability alerts
└─ Compliance status

Codecov:
├─ Coverage trends
├─ Branch comparison
└─ Badge embeddable

CloudWatch:
├─ Application metrics
├─ Logs from EKS
└─ Alerts
```

## Rollback

### Estrategia

```
Automatic Rollback:
├─ Health check fallos
├─ Error rate > 5%
└─ CPU/Memory spikes

Manual Rollback:
├─ kubectl rollout undo
├─ GitHub release revert
└─ Tag anterior
```

## Costos Estimados

### GitHub Actions

```
Backend Services (9):
├─ Lint: 9 × 5 min = 45 min
├─ Test: 9 × 10 min = 90 min
├─ Build: 9 × 5 min = 45 min
└─ Docker: 9 × 15 min = 135 min

Frontend Apps (3):
├─ Lint: 3 × 5 min = 15 min
├─ Test: 3 × 8 min = 24 min
├─ Build: 3 × 5 min = 15 min
└─ Total: ~54 min

Infra:
├─ Validation: ~10 min
└─ Security: ~10 min

Total por ejecución: ~60 minutos
Ejecuciones/día: 20-30
Minutos/mes: ~30,000
Costo mensual: ~$0 (primeros 2,000 min gratis, luego $0.008/min)
```

## Mantenimiento

### Actualización de Versiones

```
Node.js:
├─ Actualizar en workflows
├─ Probar en branch
└─ Merge a main

Terraform:
├─ Actualizar setup-terraform version
├─ Test plan antes de apply
└─ Merge a main

Docker:
├─ Actualizar base image
├─ Rebuild todas imágenes
└─ Merge a main
```

### Debugging

```
Logs: GitHub Actions > Run logs
Artifacts: GitHub Actions > Artifacts
Coverage: Codecov dashboard
Security: GitHub Security tab
Deployment: CloudWatch logs
```

