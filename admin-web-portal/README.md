# Admin Web Portal

![Coverage](https://img.shields.io/codecov/c/github/JuanLuisGozaloFdez/nft-platform-umbrella?label=coverage)

## Overview
- React + Vite + TypeScript, TailwindCSS
- React Router, React Query, Axios
- i18n with locale-aware number/date/currency
- Recharts for basic charts
- JWT-based auth with role guards (`admin`, `organizer`)

## Recent Changes
- Events hooks (`useEvents`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`) and client-side filters.
- Dashboard KPIs consuming `/api/stats/kpis` and initial line chart.
- Auth: `RequireRole` guard, `AuthProvider` hydrates via `/api/auth/me`, spinner to avoid flicker.
- Login page posts to `/api/auth/login` and stores `admin_jwt` + `admin_role`.
- Toasts: gentle messages for 4xx/5xx via Axios interceptor; logout toast.
- Interceptor: clears token and redirects to `/login` on `401`; toasts for `403/404/429/5xx`.
- Audits: page `/audits` with filters, pagination, and CSV export; backend endpoints `/api/stats/audits` and `/api/stats/audits/export`.
- Access Denied: `/access-denied` route with redirect on 403.

## Environment Variables
Create `.env` from example and set:
```bash
cp .env.example .env
```
- `VITE_API_URL`: Backend base URL (e.g., `http://localhost:3000`).
- `VITE_ADMIN_SECRET`: Optional admin feature secret.
- `VITE_CHART_API_KEY`: Optional chart library key.
- CI secret `CODECOV_TOKEN` in the repository for coverage uploads.

## Development
```bash
npm install
npm run dev
```

## Testing
```bash
npm run test
```

## Build
```bash
npm run build
npm run preview
```

## Auth & RBAC
- Axios attaches `Authorization: Bearer <JWT>` from `localStorage` key `admin_jwt`.
- `AuthProvider` validates token with `/api/auth/me` and provides `{ loading, token, role }`.
- `RequireRole` enforces roles for protected routes.
- Logout clears `admin_jwt` and `admin_role` and redirects to `/login`.


