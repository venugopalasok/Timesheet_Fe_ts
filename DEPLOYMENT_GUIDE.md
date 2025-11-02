# AWS Amplify Deployment Guide

This guide will walk you through deploying your Timesheet Frontend to AWS Amplify.

## 📋 Prerequisites

1. **AWS Account** - Create one at [aws.amazon.com](https://aws.amazon.com)
2. **Git Repository** - Your code should be in GitHub, GitLab, Bitbucket, or AWS CodeCommit
3. **Backend Services Deployed** - Your backend APIs should be deployed and accessible via HTTPS

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. Ensure all your code is committed and pushed to your Git repository:
```bash
cd /Users/deadsec/Git_Repos/Timesheet_Fe_ts
git add .
git commit -m "Prepare for AWS Amplify deployment"
git push origin main
```

2. Verify these files exist (they've been created for you):
   - `amplify.yml` - AWS Amplify build configuration
   - `.env.example` - Example environment variables

### Step 2: Deploy Backend Services First

Before deploying the frontend, you need your backend APIs deployed and accessible. Your backend has three microservices:

1. **Save Service** (Port 3000) - Timesheet save operations
2. **Submit Service** (Port 3001) - Timesheet submit operations  
3. **Auth Service** (Port 3002) - Authentication and user management

**🎯 Recommended Approach: Use an API Gateway**

Deploy your services behind an API Gateway for better security and management. This gives you a single URL:
- `https://api.yourcompany.com`

The gateway routes requests to services based on path:
- `/auth-service/*` → Auth Service
- `/save-service/*` → Save Service
- `/submit-service/*` → Submit Service

**API Gateway Options:**
- AWS API Gateway (if using AWS)
- NGINX reverse proxy
- Kong Gateway
- Traefik

**See [API_GATEWAY_SETUP.md](API_GATEWAY_SETUP.md) for detailed configuration guides.**

**Backend Hosting Options:**
- AWS EC2 with Docker
- AWS ECS/Fargate
- AWS App Runner
- Heroku
- DigitalOcean
- Railway.app
- Render.com

After deployment with API Gateway, note down your single gateway URL:
- ✅ `https://api.yourbackend.com` (Recommended: All services behind API Gateway)

Without API Gateway (not recommended):
- ❌ Individual service URLs with ports

### Step 3: Connect to AWS Amplify

1. Log in to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)

2. Click **"New app"** → **"Host web app"**

3. Select your Git provider (GitHub, GitLab, Bitbucket, or CodeCommit)

4. Authorize AWS Amplify to access your repository

5. Select the repository: `Timesheet_Fe_ts`

6. Select the branch: `main` (or your deployment branch)

### Step 4: Configure Build Settings

1. **App name**: `timesheet-frontend` (or your preferred name)

2. **Build and test settings**: The `amplify.yml` file will be automatically detected. It contains:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. Click **"Advanced settings"** to add environment variables

### Step 5: Configure Environment Variables

Add the following environment variables in the AWS Amplify Console:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_BACKEND_URL` | `https://api.yourbackend.com` | Your backend API base URL |
| `VITE_AUTH_SERVICE_URL` | `https://api.yourbackend.com` | Your auth service URL |

**Important Notes:**
- Replace `https://api.yourbackend.com` with your actual backend URL
- All Vite environment variables MUST start with `VITE_` prefix
- These variables are embedded at BUILD time, not runtime

**🎯 Recommended: Use an API Gateway (Single URL)**

If you're using an API Gateway (AWS API Gateway, NGINX, Kong, Traefik), you only need **ONE URL** for both variables:

```
VITE_BACKEND_URL=https://api.yourcompany.com
VITE_AUTH_SERVICE_URL=https://api.yourcompany.com
```

Your API Gateway will route requests based on the path:
- `/auth-service/*` → Auth Service (port 3002)
- `/save-service/*` → Save Service (port 3000)
- `/submit-service/*` → Submit Service (port 3001)

**Your frontend already includes these path prefixes!** See [API_GATEWAY_SETUP.md](API_GATEWAY_SETUP.md) for detailed configuration.

**Alternative: Without API Gateway (Not Recommended)**

Only if you're NOT using an API Gateway and exposing services directly:
```
VITE_BACKEND_URL=https://backend.yourcompany.com:3000
VITE_AUTH_SERVICE_URL=https://backend.yourcompany.com:3002
```

⚠️ **This is NOT recommended for production** - see API Gateway guide for why.

### Step 6: Deploy

1. Click **"Save and deploy"**

2. AWS Amplify will:
   - Clone your repository
   - Install dependencies (`npm ci`)
   - Build your app (`npm run build`)
   - Deploy to CDN
   - Provide you with a URL (e.g., `https://main.d1234abcd.amplifyapp.com`)

3. Wait for the deployment to complete (usually 3-5 minutes)

### Step 7: Configure Custom Domain (Optional)

1. In AWS Amplify Console, go to **"Domain management"**

2. Click **"Add domain"**

3. Enter your domain name (e.g., `timesheet.yourdomain.com`)

4. Follow the instructions to:
   - Update your DNS settings
   - Wait for SSL certificate provisioning
   - Domain verification

## 🔍 How the Frontend Finds the Backend

Your frontend uses environment variables to locate backend services:

### 1. **Timesheet API Service** (`src/services/timesheetAPI.ts`)
```typescript
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const SAVE_SERVICE_URL = `${BASE_URL}`;
const SUBMIT_SERVICE_URL = `${BASE_URL.replace('3000', '3001')}`;
```

- **Save operations**: `${VITE_BACKEND_URL}/save-service/*`
- **Submit operations**: `${VITE_BACKEND_URL}/submit-service/*`

### 2. **Auth API Service** (`src/services/authAPI.ts`)
```typescript
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3002';
```

- **Authentication**: `${VITE_AUTH_SERVICE_URL}/auth-service/*`

### 3. **Environment Variable Fallbacks**

If environment variables are not set, the app defaults to:
- `http://localhost:3000` - For timesheet operations
- `http://localhost:3002` - For auth operations

This allows local development without environment files.

## 🔧 Local Development with Environment Variables

### Create `.env.local` file:
```bash
cp .env.example .env.local
```

### Edit `.env.local`:
```bash
# For local development with local backend
VITE_BACKEND_URL=http://localhost:3000
VITE_AUTH_SERVICE_URL=http://localhost:3002

# For local development with deployed backend
# VITE_BACKEND_URL=https://api.yourbackend.com
# VITE_AUTH_SERVICE_URL=https://api.yourbackend.com
```

### Run development server:
```bash
npm run dev
```

The app will use the environment variables from `.env.local`.

## 📱 Verify Deployment

After deployment, verify everything works:

1. **Open your Amplify URL** in a browser

2. **Check browser console** (F12 → Console)
   - Should see no errors
   - API calls should succeed

3. **Test authentication**:
   - Navigate to `/signin`
   - Try logging in
   - Check if API calls reach your auth service

4. **Test timesheet operations**:
   - Navigate to `/grid`
   - Try saving/submitting timesheets
   - Check if API calls reach your backend

5. **Check Network tab** (F12 → Network)
   - Verify API calls go to correct URLs
   - Check for CORS errors

## 🔐 Backend CORS Configuration

Your backend MUST allow requests from your Amplify domain. Update your backend services:

```javascript
// In your backend services (save-service, submit-service, auth-service)
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',           // Local development
    'https://main.d1234abcd.amplifyapp.com',  // Amplify URL
    'https://timesheet.yourdomain.com'  // Custom domain (if any)
  ],
  credentials: true
}));
```

Or allow all origins (not recommended for production):
```javascript
app.use(cors());
```

## 🔄 Continuous Deployment

AWS Amplify automatically deploys when you push to your connected branch:

1. Make changes to your code
2. Commit and push:
```bash
git add .
git commit -m "Update feature"
git push origin main
```
3. AWS Amplify automatically detects the push and redeploys

## 🛠️ Update Environment Variables After Deployment

If you need to change environment variables after deployment:

1. Go to AWS Amplify Console
2. Select your app
3. Go to **"Environment variables"** in the left sidebar
4. Update the variables
5. Click **"Save"**
6. Go to **"Redeploy this version"** to rebuild with new variables

**Important**: Environment variables are embedded at BUILD time, so you must redeploy after changing them.

## 🐛 Troubleshooting

### Issue: "API calls are failing"
**Solution**: 
- Check browser console for CORS errors
- Verify `VITE_BACKEND_URL` and `VITE_AUTH_SERVICE_URL` are correct
- Ensure backend services are running and accessible
- Check backend CORS configuration

### Issue: "Environment variables not working"
**Solution**:
- Verify variable names start with `VITE_`
- Check they're set in AWS Amplify Console (not just `.env.local`)
- Redeploy the app after adding variables
- Check build logs for any errors

### Issue: "Build fails on Amplify"
**Solution**:
- Check build logs in Amplify Console
- Verify `package.json` and `package-lock.json` are committed
- Ensure `amplify.yml` is in repository root
- Check for TypeScript errors: `npm run build` locally

### Issue: "404 errors on page refresh"
**Solution**: Add rewrites in Amplify Console:
1. Go to **"Rewrites and redirects"**
2. Add rule:
   - Source: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
   - Target: `/index.html`
   - Type: `200 (Rewrite)`

This enables client-side routing for React Router.

## 📊 Monitoring

Monitor your deployment:

1. **Amplify Console** → **"Monitoring"**
   - View deployment history
   - Check build logs
   - Monitor traffic

2. **CloudWatch** (automatic integration)
   - Request counts
   - Error rates
   - Performance metrics

## 💰 Cost Estimate

AWS Amplify pricing (as of 2024):
- **Build minutes**: First 1,000 minutes/month free, then $0.01/minute
- **Hosting**: First 15 GB served/month free, then $0.15/GB
- **Storage**: First 5 GB free, then $0.023/GB/month

For a typical small app: $0-10/month

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)

## ✅ Checklist

- [ ] Backend services deployed and accessible
- [ ] Repository pushed to Git provider
- [ ] AWS account created
- [ ] `amplify.yml` file in repository
- [ ] Connected repository to AWS Amplify
- [ ] Environment variables configured in Amplify
- [ ] Initial deployment successful
- [ ] Tested authentication flow
- [ ] Tested timesheet save/submit
- [ ] Backend CORS configured
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

## 🎉 Next Steps

After successful deployment:

1. **Test thoroughly** in production environment
2. **Set up custom domain** (if needed)
3. **Configure CI/CD** for automated testing
4. **Enable branch deployments** for staging environments
5. **Set up monitoring and alerts**
6. **Configure password protection** for preview deployments (if needed)

---

Need help? Check the troubleshooting section or review the AWS Amplify documentation.

