# Smart Tourism Platform — Server

## Quick start (local, without Docker)
1. Copy `.env.example` to `.env` and set `DATABASE_URL`
2. Run migrations + seed:
   - `npm run migrate`
   - `npm run seed`
3. Start API:
   - `npm run dev`

## Endpoints
- `GET /healthz`
- `GET /metrics`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/admin/auth/login`
- `GET /api/destinations`
- `GET /api/destinations/:slug`

Default port: `8085` (configurable via `PORT` in `.env`).

