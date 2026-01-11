# CI/CD Configuration

## Overview

Este directorio contiene la configuración centralizada para los workflows de CI/CD de toda la plataforma de ticketing NFT.

### Estructura

- **platform-umbrella.yml**: Workflow maestro que coordina todo el pipeline
- **Workflows individuales**: 
  - `backend-ci.yml`: Para todos los servicios backend
  - `frontend-ci.yml`: Para todas las apps frontend
  - `infra-ci.yml`: Para validación de infraestructura

### Fases del Pipeline

#### 1. Validación (Paralela)
- ESLint + Prettier
- Terraform validation + TFLint
- Kubernetes manifest validation
- Security scanning (Trivy, Checkov)

#### 2. Tests (Paralela)
- Unit tests backend
- Integration tests backend
- Unit tests frontend
- E2E tests frontend

#### 3. Build (Paralela)
- Build servicios backend
- Build apps frontend
- Validación artefactos

#### 4. Docker Images
- Build y push de imágenes a GitHub Container Registry
- Tags: branch, version, sha

#### 5. Deployment
- Deploy a Kubernetes (main branch)
- Verificación de salud

### Secretos Requeridos

Configure en GitHub repository settings:

```
GITHUB_TOKEN: Automático
AWS_ACCESS_KEY_ID: AWS credentials
AWS_SECRET_ACCESS_KEY: AWS credentials
SLACK_WEBHOOK_URL: Para notificaciones (opcional)
```

### Variables Requeridas

Configure en GitHub repository variables:

```
SLACK_WEBHOOK_URL: Slack webhook para notificaciones
```

### Triggers

- **Push** a `main` o `develop`
- **Pull Request** a `main` o `develop`
- **Schedule**: Diariamente a las 2 AM UTC (validaciones de seguridad)
- **Manual**: Disparo manual con selección de entorno

### Paralelización

- Máximo 3 servicios backend en paralelo (test)
- Máximo 3 apps frontend en paralelo (test)
- Máximo 3 servicios en paralelo (build)

### Costo estimado (GitHub Actions)

- Backend: ~45 min (9 servicios × 5 min paralelo)
- Frontend: ~15 min (3 apps × 5 min paralelo)
- Infra: ~10 min
- Total: ~60 minutos por ejecución

### Monitoreo

- Workflow runs en Actions tab
- Notificaciones en Slack
- Reporte de cobertura en Codecov
- Resultados de seguridad en Security tab

