# Deployment Guide

Complete guide for deploying the homelab monitoring system.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Network Setup](#network-setup)
- [DNS Configuration](#dns-configuration)
- [Docker Setup](#docker-setup)
- [Nginx Configuration](#nginx-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [Security Hardening](#security-hardening)

## Overview

This guide covers deploying the complete monitoring system with:
- Frontend accessible publicly via HTTPS
- API accessible only on local network
- Automatic SSL certificate management
- Docker containerisation
- Nginx reverse proxy

### Architecture

![Architecture Preview](docs/images/deployment/architecture.png)

## Prerequisites

### Software Requirements

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
  docker.io \
  docker-compose \
  nginx \
  certbot \
  python3-certbot-nginx \
  git
```

### Access Requirements

- Domain name (e.g., `gabrielg.tech`)
- Access to domain DNS settings
- Router admin access for port forwarding

## Network Setup

### 1. Assign Static IP to computer

**Option A: Via Router (Recommended)**

- Access router admin panel
  - Find DHCP settings
  - Reserve IP `192.168.0.24` for Pi's MAC address

**Option B: On Computer**

Manually set static IP (if doing this, you probably don't need this guid).

### 2. Configure Port Forwarding

Log into your router and forward these ports to `192.168.0.2`*:

_\* Replace with the static IP assigned to your monitoring server._

| External Port | Internal Port | Protocol | Service |
|---------------|---------------|----------|---------|
| 80            | 80            | TCP      | HTTP    |
| 443           | 443           | TCP      | HTTPS   |

**Do NOT forward port 8191** - keep the API local only.

### 3. Configure Firewall (UFW)

```bash
# Install UFW if not present
sudo apt install ufw

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## DNS Configuration

### 1. Get Your Public IP

```bash
curl ifconfig.me
```

Example output: `81.106.48.39`

### 2. Add DNS Records

In your domain registrar's DNS settings, add:

**A Record:**

| Type | Hostname     | Value          | TTL  |
|------|--------------|----------------|------|
| A    | `monitoring` | `81.106.48.39` | 3600 |

**CNAME Record (optional):**

| Type  | Hostname         | Value                      | TTL  |
|-------|------------------|----------------------------|------|
| CNAME | `www.monitoring` | `monitoring.gabrielg.tech` | 3600 |

### 3. Verify DNS Propagation

Wait 5-15 minutes, then test:
```bash
# Check A record
nslookup monitoring.gabrielg.tech

# Should return your public IP
dig monitoring.gabrielg.tech +short
```

## Docker Setup

### 1. Create Directory Structure

```bash
mkdir -p ~/services/{monitor-api,monitor-frontend}
mkdir -p ~/data/monitor-db
```

### 2. Create Docker Compose File

Create `~/services/docker-compose.yml`:
```yaml
services:
  api:
    image: ghcr.io/gabrielg2020/monitor-api:latest
    container_name: monitor-api
    restart: unless-stopped
    ports:
      - "127.0.0.1:8191:8191"  # Only accessible from localhost
    volumes:
      - ../data/monitor-db:/app/data
    environment:
      - DB_PATH=/app/data/monitoring.db
      - PORT=8191
      - GIN_MODE=release
      - ALLOWED_ORIGINS=http://192.168.0.24,https://monitoring.gabrielg.tech

  frontend:
    image: ghcr.io/gabrielg2020/monitor-frontend:latest
    container_name: monitor-frontend
    restart: unless-stopped
    ports:
      - "127.0.0.1:5173:80"  # Only accessible via nginx proxy
    environment:
      - API_ADDRESS=https://monitoring.gabrielg.tech
      - API_VERSION=v1
```

### 3. Start Containers

```bash
cd ~/services
docker-compose up -d

# Verify containers are running
docker ps

# Check logs
docker logs monitor-frontend
docker logs monitor-api
```


## Nginx Configuration

### 1. Remove Default Configuration (!DANGER!)

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 2. Create Monitoring Site Configuration

Create `/etc/nginx/sites-available/monitoring`:
```nginx
# HTTP - Will be used by Certbot for verification
server {
    listen 80;
    listen [::]:80;
    server_name monitoring.gabrielg.tech www.monitoring.gabrielg.tech;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

_\* Replace `gabrielg.tech` to your domain._

### 3. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Test HTTP Access

```bash
curl http://monitoring.gabrielg.tech
```

Should return HTML from your frontend.

## SSL/TLS Setup

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d monitoring.gabrielg.tech -d www.monitoring.gabrielg.tech
```

Follow the prompts:
- Enter email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

You should see this section added to your nginx config:
```nginx
# SSL Configuration (managed by Certbot)
...
```

### 3. Update Nginx Configuration

#### `Gzip` Compression

```nginx
# Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
    gzip_disable "msie6";
```

#### Make the API Proxy Read Only

```nginx
# API Proxy - READ ONLY
    location /api/ {
        # Only allow GET and OPTIONS requests
        if ($request_method !~ ^(GET|OPTIONS)$) {
            return 405;
        }
        
        proxy_pass http://localhost:8191/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

### 4. Test and Reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Test SSL

```bash
# Test HTTPS
curl https://monitoring.gabrielg.tech

# Check SSL certificate
curl -vI https://monitoring.gabrielg.tech 2>&1 | grep -i "SSL"
```

### 6. Auto-Renewal

Certbot automatically sets up a cron job for renewal. Test it:
```bash
sudo certbot renew --dry-run
```

## Setup Monitor Agent

Refer to the [Monitor Agent repository](https://github.com/gabrielg2020/monitor-agent) for instructions on setting up the monitoring agent on your devices.

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [UFW Documentation](https://help.ubuntu.com/community/UFW)

**Last Updated:** October 2025  
**Tested On:** Raspberry Pi 4 (4GB), Ubuntu Server 24.04 LTS