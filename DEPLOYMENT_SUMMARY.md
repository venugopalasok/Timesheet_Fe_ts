# Deployment Configuration Summary

This document summarizes all the deployment files and configurations created for your AWS Amplify deployment.

## 📄 Files Created

### 1. `amplify.yml` ✅
**Purpose**: AWS Amplify build configuration

**What it does**:
- Tells AWS Amplify how to build your React app
- Defines build commands: `npm ci` and `npm run build`
- Specifies output directory: `dist/`
- Configures build caching for faster deployments

**Do NOT modify unless**: You need custom build steps or deploy to a different directory

---

### 2. `API_GATEWAY_SETUP.md` ✅
**Purpose**: Comprehensive API Gateway configuration guide

**What it does**:
- Explains why API Gateway is recommended (vs direct service exposure)
- Provides setup guides for:
  - AWS API Gateway
  - NGINX reverse proxy
  - Kong Gateway
  - Traefik
- Includes complete configuration examples
- Shows how frontend connects through gateway

**Read this if**: You're using (or planning to use) an API Gateway for your backend

---

### 3. `env.template` ✅
**Purpose**: Environment variables template

**What it does**:
- Shows which environment variables are needed
- Provides examples for local and production URLs
- Acts as documentation for configuration

**How to use**:
```bash
# For local development:
cp env.template .env.local
# Then edit .env.local with your URLs
```

**Important**: Never commit `.env.local` to Git (it's in `.gitignore`)

---

### 3. `DEPLOYMENT_GUIDE.md` ✅
**Purpose**: Comprehensive deployment instructions

**Contains**:
- Step-by-step AWS Amplify setup
- Environment variable configuration
- Backend CORS setup
- Custom domain configuration
- Troubleshooting guide
- Cost estimates
- Complete explanation of how frontend finds backend

**Read this for**: Detailed deployment walkthrough

---

### 4. `AWS_AMPLIFY_QUICKSTART.md` ✅
**Purpose**: Quick reference guide

**Contains**:
- 5-minute quick start
- Architecture diagrams
- Common issues and fixes
- Checklists
- Command reference

**Read this for**: Fast deployment or as a quick reference

---

### 5. `DEPLOYMENT_CHECKLIST.md` ✅
**Purpose**: Interactive deployment checklist

**Contains**:
- Pre-deployment checklist
- During deployment checklist
- Post-deployment testing checklist
- Troubleshooting steps

**Use this**: Print it out or keep it open while deploying

---

### 6. `README.md` ✅ (Updated)
**Purpose**: Main project documentation

**Updates made**:
- Added project description and features
- Added deployment instructions with links
- Added project structure
- Added backend integration overview
- Added technology stack

---

## 🔑 Key Concepts

### Environment Variables

Your frontend needs to know where your backend is. This is configured through environment variables:

```bash
VITE_BACKEND_URL=https://your-backend.com
VITE_AUTH_SERVICE_URL=https://your-backend.com
```

**Important points**:
1. Must start with `VITE_` (Vite requirement)
2. Set in AWS Amplify Console (not in code)
3. Embedded at BUILD time (not runtime)
4. Changes require redeployment

### How Frontend Finds Backend

**Location 1**: `src/services/timesheetAPI.ts`
```typescript
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
```

**Location 2**: `src/services/authAPI.ts`
```typescript
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3002';
```

**Fallback**: If environment variables aren't set, defaults to `localhost` (for local development)

### API Endpoints

Your app makes requests to:

**Authentication** (`authAPI.ts`):
- `${VITE_AUTH_SERVICE_URL}/auth-service/register`
- `${VITE_AUTH_SERVICE_URL}/auth-service/login`
- `${VITE_AUTH_SERVICE_URL}/auth-service/profile`
- `${VITE_AUTH_SERVICE_URL}/auth-service/verify-token`

**Timesheet Operations** (`timesheetAPI.ts`):
- `${VITE_BACKEND_URL}/save-service/timesheets`
- `${VITE_BACKEND_URL}/submit-service/timesheets`
- `${VITE_BACKEND_URL}/save-service/timesheets/weekly`
- `${VITE_BACKEND_URL}/submit-service/timesheets/weekly`

## 🚀 Quick Start Deployment

### Step 1: Deploy Backend
Deploy your three backend services:
1. Auth Service (Port 3002)
2. Save Service (Port 3000)
3. Submit Service (Port 3001)

Note their URLs.

### Step 2: Push to Git
```bash
git add .
git commit -m "Ready for AWS Amplify deployment"
git push origin main
```

### Step 3: AWS Amplify
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your repository
4. Add environment variables (see Step 4)
5. Deploy

### Step 4: Environment Variables
In AWS Amplify Console, add:

**With API Gateway (Recommended):**
```
VITE_BACKEND_URL=https://api.yourcompany.com
VITE_AUTH_SERVICE_URL=https://api.yourcompany.com
```
Both use the same URL! Gateway routes by path. See [API_GATEWAY_SETUP.md](API_GATEWAY_SETUP.md)

### Step 5: Test
1. Open Amplify URL
2. Test sign up/sign in
3. Test timesheet operations
4. Check browser console for errors

## 📊 Architecture

```
┌────────────────────────────────┐
│     User's Browser             │
└───────────┬────────────────────┘
            │
            │ HTTPS
            ▼
┌────────────────────────────────┐
│    AWS Amplify (CDN)           │
│  Your React App (Static)       │
│  - HTML, CSS, JS bundled       │
│  - Environment vars embedded   │
└───────────┬────────────────────┘
            │
            │ API Calls (HTTPS)
            ▼
┌────────────────────────────────┐
│    Your Backend Services       │
│  ┌──────────────────────────┐ │
│  │ Auth Service (3002)      │ │
│  │ /auth-service/*          │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ Save Service (3000)      │ │
│  │ /save-service/*          │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ Submit Service (3001)    │ │
│  │ /submit-service/*        │ │
│  └──────────────────────────┘ │
└───────────┬────────────────────┘
            │
            ▼
     ┌─────────────┐
     │  MongoDB    │
     └─────────────┘
```

## 🔧 Local Development

```bash
# 1. Create local environment file
cp env.template .env.local

# 2. Edit .env.local
VITE_BACKEND_URL=http://localhost:3000
VITE_AUTH_SERVICE_URL=http://localhost:3002

# 3. Run dev server
npm run dev
```

## 🌐 Deployment Flow

```
Code Change → Git Push → AWS Amplify Detects
                              ↓
                        Build Process
                        - npm ci
                        - npm run build
                        - Embed env vars
                              ↓
                        Deploy to CDN
                              ↓
                        Your App Live! 🎉
```

## 📝 Common Tasks

### Update Code
```bash
git add .
git commit -m "Update feature"
git push origin main
# AWS Amplify auto-deploys
```

### Change Environment Variables
1. AWS Amplify Console → Environment variables
2. Update variables
3. Click "Redeploy this version"

### Check Build Status
1. AWS Amplify Console
2. Click on your app
3. View build logs

### Test Locally
```bash
npm run build
npm run preview
```

## ⚠️ Important Notes

1. **Environment Variables are Embedded at Build Time**
   - Not dynamic like server-side apps
   - Changes require redeployment
   - Visible in browser (don't put secrets!)

2. **CORS Must Be Configured**
   - Backend must allow Amplify domain
   - Update after getting Amplify URL

3. **HTTPS is Required**
   - Backend must use HTTPS in production
   - AWS Amplify provides HTTPS automatically

4. **Client-Side Routing**
   - May need rewrite rules for React Router
   - See deployment guide for details

## 🆘 Getting Help

### Documentation Files
1. **[AWS_AMPLIFY_QUICKSTART.md](AWS_AMPLIFY_QUICKSTART.md)** - Quick reference
2. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Detailed guide
3. **[API_GATEWAY_SETUP.md](API_GATEWAY_SETUP.md)** - API Gateway configuration
4. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
5. **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - API documentation

### Troubleshooting Steps
1. Check AWS Amplify build logs
2. Check browser console (F12)
3. Check Network tab for API calls
4. Verify environment variables
5. Check backend CORS configuration
6. Verify backend is running

### External Resources
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

## ✅ Success Criteria

Your deployment is successful when:
- [ ] Build completes without errors
- [ ] App loads at Amplify URL
- [ ] Can sign up new users
- [ ] Can log in
- [ ] Can save timesheets
- [ ] Can submit timesheets
- [ ] No console errors
- [ ] API calls reach backend
- [ ] Navigation works correctly

## 🎯 Next Steps

After successful deployment:
1. Test thoroughly
2. Set up custom domain (optional)
3. Configure monitoring
4. Set up staging environment
5. Enable branch-based deployments
6. Configure error tracking
7. Set up CI/CD pipeline (optional)

---

**Created**: October 31, 2025

**Purpose**: AWS Amplify deployment setup for Timesheet Application

**Status**: Ready for deployment ✅

---

For questions or issues, refer to the documentation files listed above.

