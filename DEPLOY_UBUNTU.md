# Deploy on Ubuntu (SSH + Docker)

1. Install Docker + Compose plugin on Ubuntu.
2. Clone repository:
   - `git clone <repo-url> smart-tourism-platform`
3. Enter project:
   - `cd smart-tourism-platform`
4. Start stack:
   - `docker compose up -d --build`
5. Open:
   - Website: `http://<server-ip>`
   - API health: `http://<server-ip>/healthz`
   - Grafana: `http://<server-ip>:3000` (admin/admin)
   - Prometheus: `http://<server-ip>:9090`

## SSL with Nginx
- Put certificates on host (e.g. Let's Encrypt).
- Update `nginx/nginx.conf` to listen on 443 with `ssl_certificate` and `ssl_certificate_key`.
- Redirect 80 -> 443.

## Basic SSH hardening
- Disable password login in `/etc/ssh/sshd_config`:
  - `PasswordAuthentication no`
- Restart ssh:
  - `sudo systemctl restart ssh`

## Fail2Ban
- Copy `ops/fail2ban/jail.local` to `/etc/fail2ban/jail.local`
- Restart fail2ban:
  - `sudo systemctl restart fail2ban`

