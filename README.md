# matchpoint-web

Sitio web **solo lectura** que muestra torneos públicos consumiendo la API del proyecto [Matchpoint](https://github.com/octapf/matchpoint) (misma base de datos vía backend; sin credenciales en el navegador).

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit, Jest, ESLint.

## Requisitos

- Node.js 20+

## Configuración

1. Copiá `.env.example` a `.env.local`.
2. Definí `NEXT_PUBLIC_MATCHPOINT_API_URL` con el origen del backend (sin barra final), por ejemplo `https://tu-app-matchpoint.vercel.app`.

En el proyecto Matchpoint, si usás `CORS_ALLOWED_ORIGINS`, agregá el origen de este sitio (por ejemplo `https://matchpoint.miralab.ar`) para que el navegador permita las peticiones.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run test` — Jest
- `npm run lint` — ESLint

## Despliegue (Vercel)

Importá el repo en Vercel y configurá la variable de entorno `NEXT_PUBLIC_MATCHPOINT_API_URL` en el dashboard del proyecto. Opcional: dominio custom / subdominio en **Settings → Domains**.

## Funcionalidad

- **Listado** (`/`): torneos públicos con contadores (equipos, jugadores, lista de espera) cuando la API los devuelve.
- **Detalle** (`/tournaments/[id]`): pestañas **Resumen**, **Equipos** (`GET /api/teams`), **Partidos** y **Clasificación** (datos ampliados con `includeMatches=1` e `includeStandings=1` en el mismo torneo). Sin autenticación: torneos privados siguen sin mostrarse (404 en API).
- **SEO**: `generateMetadata` pide el nombre del torneo al backend para el título de la pestaña.
