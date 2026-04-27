# Smart Tourism Platform

Full-stack tourism / travel booking platform.

## Run the website (Frontend only)
```powershell
cd .\client
npm install
npm run dev
```
Open: `http://localhost:5173`

## Run full stack with Docker
```powershell
docker compose up -d --build
```
- Website: `http://localhost`
- API health: `http://localhost/healthz`
- API example: `http://localhost/api/destinations`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000` (`admin/admin`)

## Backend (API)
Default API port is **8085** (so it won't conflict with Jenkins on 8080).

## Included infrastructure
- Docker Compose (Postgres, Server, Client, Nginx, Prometheus, Grafana, Node Exporter)
- Jenkins pipeline (`Jenkinsfile`)
- Ubuntu deployment guide (`DEPLOY_UBUNTU.md`)
- DB backup script (`ops/backup-db.sh`)
- Fail2Ban config template (`ops/fail2ban/jail.local`)
