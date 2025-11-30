# 🏗️ Arquitectura CI/CD - Sistema de Ticketing NFT

## Visión General

Este documento describe la estrategia de CI/CD para el sistema completo de ticketing NFT basado en eventos GitHub y workflows distribuidos.

## 📊 Estructura de Workflows

### 1. **Workflows Individuales por Repositorio**

Cada repositorio tiene su propio workflow optimizado para su tipo de aplicación.

#### **Backend Services** (9 servicios)
- `backend-ci.yml` - Ejecuta: Lint → Test → Build → Docker Push

**Servicios:**
- ticketing-core-service
- wallet-assets-service
- checkin-validation-service
- users-identity-service
- payments-orders-service
- notifications-comms-service
- admin-event-ops-service
- nft-marketplace-integration
- api-gateway-bff

**Pasos:**
1. **Lint** - ESLint + TypeScript
2. **Test** - Jest con servicios de PostgreSQL y Redis
3. **Build** - Compilación TypeScript
4. **Docker** - Build y push a ghcr.io
5. **Security** - npm audit + Trivy scan

#### **Frontend Apps** (3 aplicaciones)
- `frontend-ci.yml` - Ejecuta: Lint → Build → Test → Preview Deploy

**Aplicaciones:**
- mobile-app-fans
- admin-web-portal
- checkin-scanner-app

**Pasos:**
1. **Lint** - ESLint + Prettier
2. **Build** - Webpack/Vite build
3. **Test** - Jest con cobertura
4. **Preview** - Deploy a staging en PRs

#### **Infrastructure** (1 repositorio)
- `infra-ci.yml` - Valida Terraform, Kubernetes y seguridad

**Pasos:**
1. **Terraform Validate** - fmt + validate
2. **Terraform Plan** - Plan para cambios
3. **K8s Validate** - Validación de manifiestos
4. **Security** - Trivy IaC scan

### 2. **Workflow Umbrella Coordinador**

**Archivo:** `.github/workflows/umbrella-ci.yml`

Orquesta todos los workflows individuales:
- Dispara por push/PR en rama main o develop
- Ejecuta chequeos de salud del sistema
- Proporciona visibilidad centralizada
- Permite despliegues coordinados

## 🔄 Flujos de Trabajo

### Pull Request Flow
```
PR creado → Trigger workflows individuales
         ↓
    Lint/Build/Test en paralelo
         ↓
    Validar todos los servicios
         ↓
    Deploy preview (frontends)
         ↓
    Esperar approval + merge
```

### Main Branch Flow (Deploy)
```
Push a main → Trigger workflows individuales
           ↓
    Build + tests
           ↓
    Docker images a registry
           ↓
    Terraform plan (infra)
           ↓
    Ready para manual deploy
```

## 📦 Artifacts y Outputs

### Backend Services
- `build-dist/` - Código compilado TypeScript
- Docker images: `ghcr.io/<owner>/<service>:<tag>`
- Coverage reports a Codecov

### Frontend Apps
- `build/` - Distribución compilada
- Coverage reports
- Preview deployments

### Infrastructure
- Terraform plans
- K8s manifest validations
- Security scan reports

## 🔐 Seguridad

### Integrado en Workflows
1. **npm audit** - Vulnerabilidades en dependencias
2. **Trivy** - Escaneo de IaC y filesystems
3. **SARIF Upload** - Resultados en GitHub Security tab
4. **Dependabot** - Actualizaciones automáticas de dependencias

### Configuración de Secretos Necesarios

En cada repositorio (Settings → Secrets and variables → Actions):

```
REGISTRY_USERNAME       # Usuario ghcr.io
REGISTRY_TOKEN         # Token de autenticación
DATABASE_URL           # URL base de datos para tests
REDIS_URL             # URL Redis para tests
AWS_ACCESS_KEY_ID     # Si aplica
AWS_SECRET_ACCESS_KEY # Si aplica
```

## 📈 Monitoreo y Observabilidad

### Status Checks
Cada workflow registra status en el commit/PR:
- ✅ Lint
- ✅ Test
- ✅ Build
- ✅ Docker
- ✅ Security

### Notificaciones
- Fallos de workflow → Email automático
- Security alerts → GitHub alerts
- Dependabot → Pull requests automáticos

### Métricas
- Code coverage en Codecov
- Build times
- Docker image sizes
- Deployment frequency

## 🚀 Despliegue

### Manual de Despliegue
1. Verificar que todos los workflows pasen
2. Revisar cambios en main
3. Ejecutar terraform apply para infra
4. Usar ArgoCD/Helm para servicios en K8s
5. Validar despliegue en staging
6. Promocionar a producción

### Rollback
```bash
# Usar git revert o checkout versión anterior
git revert <commit-hash>
# Re-trigger workflows para nuevo build
```

## 📋 Checklists

### Nuevo Servicio
- [ ] Crear carpeta con estructura estándar
- [ ] Copiar `backend-ci.yml` en `.github/workflows/`
- [ ] Crear `Dockerfile`
- [ ] Crear `package.json` con scripts estándar
- [ ] Agregar en `umbrella-ci.yml`
- [ ] Agregar en `dependabot.yml`

### Nuevo Repositorio Frontend
- [ ] Copiar `frontend-ci.yml` en `.github/workflows/`
- [ ] Configurar build output path
- [ ] Agregar en `umbrella-ci.yml`

### Nuevo Repositorio Infra
- [ ] Copiar `infra-ci.yml`
- [ ] Agregar terrraform/k8s estructuras
- [ ] Configurar variables necesarias

## 🔗 Referencias

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Build & Push Action](https://github.com/docker/build-push-action)
- [Terraform GitHub Action](https://github.com/hashicorp/setup-terraform)
- [Trivy Vulnerability Scanner](https://github.com/aquasecurity/trivy-action)

## 👤 Owners y Responsabilidades

- **DevOps Lead**: Mantiene workflows umbrella e infra
- **Backend Lead**: Mantiene backend-ci.yml
- **Frontend Lead**: Mantiene frontend-ci.yml
- **Security Lead**: Valida políticas de seguridad

---

**Última actualización:** 29 de noviembre, 2025
**Versión:** 1.0
