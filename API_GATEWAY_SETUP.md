# API Gateway Configuration Guide

## Overview

Using an API Gateway is the **recommended approach** for production deployments. It provides a single entry point for all your backend services.

## Architecture with API Gateway

```
┌─────────────────────────────────┐
│   AWS Amplify (Frontend)        │
│   React App                     │
└────────────┬────────────────────┘
             │
             │ HTTPS
             ▼
┌─────────────────────────────────┐
│   API Gateway                   │
│   https://api.yourcompany.com   │
│                                  │
│   Routes:                       │
│   /auth-service/*    → Port 3002│
│   /save-service/*    → Port 3000│
│   /submit-service/*  → Port 3001│
└────────────┬────────────────────┘
             │
             ├───────────┬─────────────┐
             ▼           ▼             ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │  Auth    │ │  Save    │ │  Submit  │
      │  Service │ │  Service │ │  Service │
      │  :3002   │ │  :3000   │ │  :3001   │
      └──────────┘ └──────────┘ └──────────┘
             │           │             │
             └───────────┴─────────────┘
                         ▼
                   ┌──────────┐
                   │ MongoDB  │
                   └──────────┘
```

## Environment Variables Configuration

### With API Gateway (Recommended) ✅

Set **ONE URL** for all services:

```bash
VITE_BACKEND_URL=https://api.yourcompany.com
VITE_AUTH_SERVICE_URL=https://api.yourcompany.com
```

Your frontend will make calls to:
- `https://api.yourcompany.com/auth-service/register`
- `https://api.yourcompany.com/auth-service/login`
- `https://api.yourcompany.com/save-service/timesheets`
- `https://api.yourcompany.com/submit-service/timesheets`

### Without API Gateway (Not Recommended) ❌

Would require separate URLs:

```bash
VITE_BACKEND_URL=https://save.yourcompany.com:3000
VITE_AUTH_SERVICE_URL=https://auth.yourcompany.com:3002
```

**Problems with this approach:**
- Exposes services directly to internet
- Multiple CORS configurations needed
- Harder to secure
- More complex SSL certificate management
- No centralized rate limiting

## API Gateway Options

### 1. AWS API Gateway

**Best for:** AWS-hosted applications

**Setup:**
1. Create REST API or HTTP API in AWS API Gateway
2. Create routes for each service:
   - `ANY /auth-service/{proxy+}` → Auth Service
   - `ANY /save-service/{proxy+}` → Save Service
   - `ANY /submit-service/{proxy+}` → Submit Service
3. Configure integrations (HTTP proxy to your services)
4. Deploy API
5. Use API Gateway URL in frontend

**Pros:**
- Native AWS integration
- Easy to set up with Lambda, ECS, or EC2
- Built-in monitoring with CloudWatch
- Request throttling and caching
- Custom domain names

**Cons:**
- Can be expensive at scale
- Learning curve for configuration

**Example Configuration:**

```yaml
# AWS API Gateway Routes
/auth-service/{proxy+}:
  ANY:
    integration: HTTP_PROXY
    uri: http://internal-lb.com:3002/{proxy}

/save-service/{proxy+}:
  ANY:
    integration: HTTP_PROXY
    uri: http://internal-lb.com:3000/{proxy}

/submit-service/{proxy+}:
  ANY:
    integration: HTTP_PROXY
    uri: http://internal-lb.com:3001/{proxy}
```

---

### 2. NGINX Reverse Proxy

**Best for:** Self-hosted or cloud VM deployments

**Setup:**

```nginx
# /etc/nginx/sites-available/api-gateway

server {
    listen 80;
    listen 443 ssl http2;
    server_name api.yourcompany.com;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    # CORS Configuration
    add_header 'Access-Control-Allow-Origin' 'https://yourapp.amplifyapp.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        return 204;
    }

    # Auth Service
    location /auth-service/ {
        proxy_pass http://localhost:3002/auth-service/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Save Service
    location /save-service/ {
        proxy_pass http://localhost:3000/save-service/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Submit Service
    location /submit-service/ {
        proxy_pass http://localhost:3001/submit-service/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
```

**Enable and restart:**
```bash
sudo ln -s /etc/nginx/sites-available/api-gateway /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Pros:**
- Free and open source
- Very fast and lightweight
- Great for self-hosted deployments
- Easy to configure
- Built-in load balancing

**Cons:**
- Need to manage server yourself
- Need to handle SSL certificates (use Let's Encrypt)

---

### 3. Kong Gateway

**Best for:** Enterprise applications, complex routing

**Docker Compose Setup:**

```yaml
version: '3.8'

services:
  kong-database:
    image: postgres:13
    environment:
      POSTGRES_USER: kong
      POSTGRES_DB: kong
      POSTGRES_PASSWORD: kong
    volumes:
      - kong_data:/var/lib/postgresql/data

  kong-migrations:
    image: kong:latest
    command: kong migrations bootstrap
    depends_on:
      - kong-database
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_PASSWORD: kong

  kong:
    image: kong:latest
    ports:
      - "8000:8000"
      - "8443:8443"
      - "8001:8001"
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_PASSWORD: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
    depends_on:
      - kong-database

volumes:
  kong_data:
```

**Configure routes:**
```bash
# Add Auth Service
curl -i -X POST http://localhost:8001/services \
  --data name=auth-service \
  --data url=http://localhost:3002

curl -i -X POST http://localhost:8001/services/auth-service/routes \
  --data 'paths[]=/auth-service' \
  --data 'strip_path=false'

# Add Save Service
curl -i -X POST http://localhost:8001/services \
  --data name=save-service \
  --data url=http://localhost:3000

curl -i -X POST http://localhost:8001/services/save-service/routes \
  --data 'paths[]=/save-service' \
  --data 'strip_path=false'

# Add Submit Service
curl -i -X POST http://localhost:8001/services \
  --data name=submit-service \
  --data url=http://localhost:3001

curl -i -X POST http://localhost:8001/services/submit-service/routes \
  --data 'paths[]=/submit-service' \
  --data 'strip_path=false'

# Enable CORS plugin
curl -i -X POST http://localhost:8001/plugins \
  --data name=cors \
  --data config.origins=https://yourapp.amplifyapp.com \
  --data config.credentials=true
```

**Pros:**
- Enterprise-grade features
- Plugin ecosystem (rate limiting, auth, logging, etc.)
- Great documentation
- Active community

**Cons:**
- More complex setup
- Requires database (PostgreSQL)
- Heavier resource usage

---

### 4. Traefik

**Best for:** Docker/Kubernetes deployments

**Docker Compose with Traefik:**

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  auth-service:
    image: your-auth-service
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.auth.rule=Host(`api.yourcompany.com`) && PathPrefix(`/auth-service`)"
      - "traefik.http.services.auth.loadbalancer.server.port=3002"

  save-service:
    image: your-save-service
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.save.rule=Host(`api.yourcompany.com`) && PathPrefix(`/save-service`)"
      - "traefik.http.services.save.loadbalancer.server.port=3000"

  submit-service:
    image: your-submit-service
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.submit.rule=Host(`api.yourcompany.com`) && PathPrefix(`/submit-service`)"
      - "traefik.http.services.submit.loadbalancer.server.port=3001"
```

**Pros:**
- Perfect for Docker/Kubernetes
- Auto-discovery of services
- Automatic HTTPS with Let's Encrypt
- Modern and cloud-native

**Cons:**
- Steeper learning curve
- Best suited for containerized environments

---

## Frontend Configuration

### AWS Amplify Console

1. Go to your Amplify app
2. Navigate to **Environment variables**
3. Add or update:

```
Key: VITE_BACKEND_URL
Value: https://api.yourcompany.com

Key: VITE_AUTH_SERVICE_URL
Value: https://api.yourcompany.com
```

4. Click **Save**
5. **Redeploy** your application

### Local Development

Update your `.env.local`:

```bash
# Point to your API Gateway
VITE_BACKEND_URL=https://api.yourcompany.com
VITE_AUTH_SERVICE_URL=https://api.yourcompany.com

# Or point to local services for development
# VITE_BACKEND_URL=http://localhost:3000
# VITE_AUTH_SERVICE_URL=http://localhost:3002
```

---

## Testing Your API Gateway

### 1. Test Health Endpoints

```bash
# Auth Service
curl https://api.yourcompany.com/auth-service/health

# Save Service
curl https://api.yourcompany.com/save-service/health

# Submit Service
curl https://api.yourcompany.com/submit-service/health
```

### 2. Test Authentication

```bash
curl -X POST https://api.yourcompany.com/auth-service/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test CORS

```bash
curl -H "Origin: https://yourapp.amplifyapp.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://api.yourcompany.com/auth-service/login \
  -v
```

Should return CORS headers:
```
Access-Control-Allow-Origin: https://yourapp.amplifyapp.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
```

---

## Benefits Summary

### With API Gateway ✅

- **Single URL**: `https://api.yourcompany.com`
- **Centralized CORS**: Configure once
- **Better Security**: Services not directly exposed
- **Easy SSL**: One certificate
- **Monitoring**: Single point for logs
- **Rate Limiting**: Control traffic centrally
- **Load Balancing**: Distribute load
- **Caching**: Cache responses
- **Authentication**: Centralized auth middleware

### Without API Gateway ❌

- Multiple URLs to manage
- Multiple CORS configurations
- Services exposed to internet
- Multiple SSL certificates
- Harder to monitor
- No centralized rate limiting
- No load balancing
- No caching layer
- Complex authentication

---

## Recommended Approach

**For Production:**
1. Use an API Gateway (AWS API Gateway, NGINX, Kong, or Traefik)
2. Configure single domain: `api.yourcompany.com`
3. Set up SSL/TLS
4. Configure CORS for your Amplify domain
5. Set environment variables to gateway URL

**For Development:**
1. Run services locally without gateway
2. Use localhost URLs in `.env.local`
3. Each service on its own port

---

## Quick Reference

### Environment Variables

```bash
# Production (with API Gateway)
VITE_BACKEND_URL=https://api.yourcompany.com
VITE_AUTH_SERVICE_URL=https://api.yourcompany.com

# Development (local services)
VITE_BACKEND_URL=http://localhost:3000
VITE_AUTH_SERVICE_URL=http://localhost:3002
```

### API Gateway Routes

| Path | Target Service | Port |
|------|---------------|------|
| `/auth-service/*` | Auth Service | 3002 |
| `/save-service/*` | Save Service | 3000 |
| `/submit-service/*` | Submit Service | 3001 |

### Frontend API Calls

| Endpoint | Full URL |
|----------|----------|
| Register | `${VITE_AUTH_SERVICE_URL}/auth-service/register` |
| Login | `${VITE_AUTH_SERVICE_URL}/auth-service/login` |
| Save Timesheet | `${VITE_BACKEND_URL}/save-service/timesheets` |
| Submit Timesheet | `${VITE_BACKEND_URL}/submit-service/timesheets` |

---

## Need Help?

- Review your API Gateway documentation
- Check CORS configuration
- Verify SSL certificates
- Test with curl before deploying frontend
- Check API Gateway logs for routing issues

**Your frontend is already configured correctly for API Gateway!** Just set the environment variables to your gateway URL and you're good to go.


