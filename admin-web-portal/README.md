# Admin Web Portal

## Variables de entorno
- `VITE_API_URL`: URL base del API Gateway (ej. `http://api-gateway:3000`).
- `VITE_ADMIN_SECRET`: secreto para features administrativas.
- `VITE_CHART_API_KEY`: clave para librerías de gráficos si aplica.

Copiar `.env.example` a `.env` y ajustar valores:
```bash
cp .env.example .env
```

## Desarrollo
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

