# 📋 Guía de Despliegue - Sistema de Ticketing NFT

## Arquitectura de Despliegue

```
[GitHub Workflows]
       ↓
   [Build/Test]
       ↓
   [Docker Registry] (ghcr.io)
       ↓
  [Kubernetes Cluster]
       ↓
  [ArgoCD] (GitOps)
       ↓
  [Production]
```

## Pre-requisitos

- Acceso a repositorio GitHub
- Kubectl configurado
- Acceso a ghcr.io
- Acceso a cluster Kubernetes
- ArgoCD instalado en cluster

## Flujo de Despliegue

### 1. Desarrollo y Testing
```bash
# Developer trabaja en feature branch
git checkout -b feature/nueva-funcionalidad

# Commit y push
git push origin feature/nueva-funcionalidad

# Workflow automático se ejecuta:
# ✓ Lint check
# ✓ Unit tests
# ✓ Build
# ✓ Security scan
```

### 2. Pull Request y Review
```bash
# Abrir PR
# Los workflows ejecutan nuevamente
# Code review + approval requerido

# Merge a develop
git merge --no-ff feature/nueva-funcionalidad
```

### 3. Staging Deploy (Automático)
```bash
# Push a develop dispara despliegue a staging
# ArgoCD detecta cambio en Git
# ArgoCD despliega a ambiente staging
# Validaciones automáticas
```

### 4. Production Deploy (Manual)
```bash
# Cuando ready, crear tag de versión
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Workflow dispara build final
# Docker images taggeadas con versión
# Esperar approval manual en Actions
# ArgoCD despliega a producción
```

## Comandos Útiles

### Ver status de workflows
```bash
gh workflow list
gh run list --branch main
gh run view <run-id>
```

### Re-trigger workflow
```bash
gh workflow run backend-ci.yml --ref main
```

### Ver logs de workflow
```bash
gh run view <run-id> --log
```

### Rollback manual
```bash
# Revert commit
git revert <commit-hash>
git push

# Workflow se dispara automáticamente
# ArgoCD detecta cambio
# Automáticamente rollback en K8s
```

## Troubleshooting

### Workflow falla por timeout
- Aumentar timeout en workflow YAML
- Verificar servicios de test (DB, Redis)
- Reducir paralelismo si recursos insuficientes

### Docker push falla
- Verificar credenciales en secrets
- Verificar que REGISTRY_TOKEN es válido
- Verificar permisos en ghcr.io

### Kubernetes deploy falla
- Verificar manifiestos: `kubectl apply -f k8s/ --dry-run=client`
- Ver eventos: `kubectl describe pod <pod-name>`
- Ver logs: `kubectl logs <pod-name>`

### Security scan falla
- Revisar vulnerabilidades: `npm audit`
- Actualizar dependencias: `npm update`
- Ignorar CVEs conocidas si es necesario (con justificación)

## Monitoring

### Verificar salud del sistema
```bash
# Todos los pods running
kubectl get pods -n ticketing

# Ver recursos
kubectl top nodes
kubectl top pods

# Ver eventos
kubectl get events -n ticketing
```

### Logs centralizados
```bash
# Usar ELK stack / CloudWatch
kubectl logs -f <pod-name> -n ticketing
```

---

**Documentación de Despliegue v1.0**
