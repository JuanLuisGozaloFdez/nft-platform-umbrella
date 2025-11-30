# Ticketing System NFT - CI/CD Setup

## 📋 Contenido

Este directorio contiene la infraestructura completa de CI/CD para el Sistema de Ticketing NFT basado en microservicios y arquitectura de eventos.

## 🏗️ Estructura de Repositorios

```
nft/
├── ticketing-core-service/           # Servicios backend
├── wallet-assets-service/
├── checkin-validation-service/
├── users-identity-service/
├── payments-orders-service/
├── notifications-comms-service/
├── admin-event-ops-service/
├── nft-marketplace-integration/
├── api-gateway-bff/
│
├── mobile-app-fans/                  # Frontends
├── admin-web-portal/
├── checkin-scanner-app/
│
├── platform-infra/                   # Infraestructura
│
├── nft-marketplace-smart-contracts/  # Smart Contracts (existente)
│
└── ci-cd/                            # Configuración centralizada
    ├── .github/workflows/
    │   ├── platform-umbrella.yml
    │   ├── backend-ci.yml
    │   ├── frontend-ci.yml
    │   ├── infra-ci.yml
    │   └── README.md
    ├── .eslintrc.json
    ├── .prettierrc.json
    ├── .gitignore
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    ├── CI-CD-ARCHITECTURE.md
    ├── create_repos.sh
    ├── init-cicd.sh
    └── this file
```

## 🚀 Quick Start

### 1. Crear Estructura de Repositorios

```bash
cd /home/jlg/nft
bash create_repos.sh
```

Esto crea:
- 9 servicios backend
- 3 apps frontend
- 1 repositorio de infraestructura

### 2. Inicializar CI/CD

```bash
bash init-cicd.sh
```

Este script:
- ✓ Copia archivos de configuración compartida (.eslintrc, .prettierrc, .gitignore)
- ✓ Distribuye workflows a cada repositorio
- ✓ Crea archivos .env.example
- ✓ Documenta scripts faltantes en package.json

### 3. Configurar Cada Repositorio

Para cada repositorio, ejecutar:

```bash
cd ticketing-core-service  # (o cualquier otro)
npm ci                      # Instalar dependencias
npm run lint               # Verificar linting
npm run format:check       # Verificar formato
npm test                   # Ejecutar tests
npm run build              # Build
```

### 4. Configurar Secretos de GitHub

En cada repositorio (Settings > Secrets and variables > Actions):

```
GITHUB_TOKEN              # Automático
AWS_ACCESS_KEY_ID        # AWS credentials
AWS_SECRET_ACCESS_KEY    # AWS credentials
SLACK_WEBHOOK_URL        # Notificaciones (opcional)
```

## 📊 Pipeline CI/CD

### Fases

```
PHASE 1: VALIDATION (5-10 min)
├─ Code Quality (ESLint)
├─ Frontend Quality (ESLint + Prettier)
├─ Infrastructure Validation (Terraform)
└─ Security Checks (Trivy, Checkov)

PHASE 2: TESTS (15-20 min)
├─ Backend Tests (Jest + Coverage)
├─ Frontend Tests (Jest + Coverage)
└─ Services start on PostgreSQL + Redis

PHASE 3: BUILD (10-15 min)
├─ Backend Build (TypeScript)
├─ Frontend Build (Bundle)
└─ Artifacts Upload

PHASE 4: DOCKER (15-20 min, solo push)
├─ Build Docker Images
├─ Push a GitHub Container Registry
└─ Tags: branch, semver, sha

PHASE 5: DEPLOY (solo main branch)
├─ Configure AWS credentials
├─ Deploy a Kubernetes
├─ Rollout verification
└─ Health checks
```

### Triggers

| Trigger | Fases | Deploy |
|---------|-------|--------|
| Push main | 1-5 | ✅ PROD |
| Push develop | 1-4 | ❌ Staging manual |
| Pull Request | 1-3 | ❌ No |
| Schedule (daily 2 AM) | 1, 4 | ❌ Security only |
| Manual dispatch | 1-5 | Seleccionable |

## 📁 Workflows Incluidos

### 1. platform-umbrella.yml
Workflow maestro que orquesta todo el pipeline.
- Ejecuta todos los jobs en paralelo
- Gestiona dependencias
- Notificaciones en Slack
- Resumen en GitHub

**Ubicación**: `.github/workflows/platform-umbrella.yml`

### 2. backend-ci.yml
Workflow individual para servicios backend.
- Linting: ESLint
- Tests: Jest con DB services
- Build: TypeScript compilation
- Docker: Build & push
- Security: npm audit + Trivy

**Aplicado a**: Todos los 9 servicios backend

### 3. frontend-ci.yml
Workflow individual para apps frontend.
- Linting: ESLint
- Formatting: Prettier
- Tests: Jest
- Build: Bundle build
- Security: npm audit + Trivy

**Aplicado a**: mobile-app-fans, admin-web-portal, checkin-scanner-app

### 4. infra-ci.yml
Workflow para validación de infraestructura.
- Terraform: init, validate, fmt, plan, apply
- Kubernetes: manifest validation, kube-linter
- Security: Checkov (Terraform + K8s)
- Documentation: README check

**Ubicación**: platform-infra/.github/workflows/

## 🔒 Seguridad

### Scans Automáticos

1. **npm audit**
   - Vulnerabilidades de dependencias
   - Nivel: moderate (bloquea si >= moderate)

2. **Trivy**
   - Filesystem scan
   - Docker images
   - SARIF output para GitHub

3. **Checkov**
   - Infraestructura como código
   - Políticas de compliance
   - CloudFormation, Terraform, K8s

4. **CodeQL**
   - Análisis estático
   - Securitytab de GitHub

### Gestión de Secretos

```bash
# Crear secreto (GitHub CLI)
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/..."

# Listar secretos
gh secret list

# Borrar secreto
gh secret delete SLACK_WEBHOOK_URL
```

## 📦 Artefactos

### Almacenamiento

| Artefacto | Ubicación | Retención |
|-----------|-----------|-----------|
| Build dist/ | GitHub Artifacts | 1 día |
| Coverage | Codecov | 30 días |
| Docker images | ghcr.io | Indefinido |
| Test logs | GitHub Actions | 30 días |

### Descarga

```bash
# Via GitHub CLI
gh run download <run-id> -n build-ticketing-core-service

# Via GitHub web
Actions > Run > Artifacts
```

## 🔧 Configuración Local

### Ejecutar Workflow Localmente

Usar `act` (https://github.com/nektos/act):

```bash
# Instalar
brew install act

# Ejecutar workflow
cd ticketing-core-service
act -j lint

# Con secretos
act -j lint --secret GITHUB_TOKEN=ghp_...
```

### Validar YAML

```bash
# Instalar yamllint
pip install yamllint

# Validar
yamllint .github/workflows/*.yml
```

## 📊 Monitoreo

### GitHub Actions Dashboard

```
Repository > Actions
├─ Workflow runs
├─ Job details
├─ Logs
└─ Artifacts
```

### GitHub Security

```
Repository > Security
├─ Code scanning alerts
├─ Dependabot alerts
├─ Secret scanning
└─ SARIF uploads
```

### Codecov

```
https://codecov.io/gh/YourOrg/ticketing-system
├─ Coverage trends
├─ Branch comparison
└─ Badges embeddable
```

## 🐛 Troubleshooting

### Workflow falla en lint

```bash
# Ejecutar localmente
npm run lint

# Auto-fix si es posible
npm run lint -- --fix
```

### Tests fallan

```bash
# Ejecutar con más detalle
npm test -- --verbose

# Watch mode
npm run test:watch
```

### Docker build falla

```bash
# Build localmente
docker build -f Dockerfile.backend -t test:latest .

# Con logs detallados
docker build -f Dockerfile.backend --progress=plain -t test:latest .
```

### Deploy falla

```bash
# Verificar configuración EKS
aws eks describe-cluster --name ticketing-prod

# Verificar kubectl
kubectl get nodes

# Logs de deployment
kubectl logs -n ticketing deployment/service-name
```

## 📚 Referencias

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Terraform Best Practices](https://www.terraform.io/docs/language/settings/index.html)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)

## 🔗 Enlaces Útiles

- **CI/CD Architecture**: Ver `CI-CD-ARCHITECTURE.md`
- **Workflows Readme**: Ver `.github/workflows/README.md`
- **Platform Infra Docs**: Ver `platform-infra/docs/`

## ✅ Checklist de Configuración

- [ ] Crear estructura de repositorios: `bash create_repos.sh`
- [ ] Inicializar CI/CD: `bash init-cicd.sh`
- [ ] Configurar secretos de GitHub
- [ ] Actualizar package.json scripts en cada repo
- [ ] Ejecutar tests localmente
- [ ] Hacer push a develop
- [ ] Verificar workflows en GitHub Actions
- [ ] Ajustar configuración según necesidades
- [ ] Documentar en README de cada repositorio
- [ ] Entrenar equipo en CI/CD

## 📝 Notas

- Total estimado por ejecución: **~60 minutos**
- Costo GitHub Actions: ~$0/mes (primeros 2,000 min gratis)
- Máximo paralelo: 3 jobs simultáneamente
- Sincronización de código: 15 minutos desde push a deploy en prod

## 🤝 Soporte

Para preguntas o problemas:
1. Revisar logs en GitHub Actions
2. Consultar CI-CD-ARCHITECTURE.md
3. Ejecutar workflow manualmente para debug
4. Verificar secretos y variables

---

**Última actualización**: 29 de Noviembre de 2025
**Versión**: 1.0.0
**Mantenedor**: Sistema de Ticketing NFT Team

