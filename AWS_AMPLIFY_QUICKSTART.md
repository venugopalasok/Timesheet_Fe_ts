# AWS Amplify Deployment - Quick Reference

## 🚀 Quick Start (5 Minutes)

### 1. Deploy Backend First
Your backend services MUST be deployed before deploying frontend. Note the URLs.

### 2. Push to Git
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 3. AWS Amplify Setup
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Connect your Git repository
4. Select branch: `main`

### 4. Add Environment Variables
In Amplify Console → **Environment variables**, add:

**With API Gateway (Recommended):**
```
VITE_BACKEND_URL=https://api.yourcompany.com
VITE_AUTH_SERVICE_URL=https://api.yourcompany.com
```

**Without API Gateway (Not Recommended):**
```
VITE_BACKEND_URL=https://your-backend-url.com:3000
VITE_AUTH_SERVICE_URL=https://your-auth-url.com:3002
```

💡 **Use the same URL if all services are behind an API Gateway!** See [API_GATEWAY_SETUP.md](API_GATEWAY_SETUP.md)

### 5. Deploy
Click **"Save and deploy"** and wait 3-5 minutes.

---

## 🔧 How Your Frontend Finds the Backend

### API Configuration Locations

**1. Timesheet Operations** (`src/services/timesheetAPI.ts`)
```typescript
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
```
- Save operations: `${VITE_BACKEND_URL}/save-service/*`
- Submit operations: `${VITE_BACKEND_URL}/submit-service/*`

**2. Authentication** (`src/services/authAPI.ts`)
```typescript
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3002';
```
- Auth operations: `${VITE_AUTH_SERVICE_URL}/auth-service/*`

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_BACKEND_URL` | Timesheet API base URL | `https://api.yourbackend.com` |
| `VITE_AUTH_SERVICE_URL` | Auth API base URL | `https://api.yourbackend.com` |

**Important:**
- Must start with `VITE_` prefix
- Set in AWS Amplify Console (not in code)
- Embedded at BUILD time (redeploy after changes)
- Fallback to `localhost` if not set

---

## 🔍 Local Development

### Setup `.env.local`
```bash
# Create from template
cp env.template .env.local

# Edit .env.local
VITE_BACKEND_URL=http://localhost:3000
VITE_AUTH_SERVICE_URL=http://localhost:3002
```

### Run
```bash
npm run dev
```

---

## 🌐 Backend CORS Setup

Your backend MUST allow requests from Amplify domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',                    // Local dev
    'https://main.d1234abcd.amplifyapp.com',   // Amplify URL
    'https://your-custom-domain.com'            // Custom domain
  ],
  credentials: true
}));
```

---

## 🐛 Common Issues & Fixes

### ❌ API Calls Failing
**Check:**
- [ ] Backend is deployed and running
- [ ] Environment variables are correct in Amplify Console
- [ ] Backend has CORS enabled for your Amplify domain
- [ ] URLs use HTTPS (not HTTP) in production

### ❌ Environment Variables Not Working
**Solution:**
1. Verify they start with `VITE_`
2. Set them in Amplify Console (not just `.env.local`)
3. **Redeploy** after adding/changing variables
4. Check build logs for errors

### ❌ 404 on Page Refresh
**Fix:** Add rewrite rule in Amplify Console → **Rewrites and redirects**:
- Source: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
- Target: `/index.html`
- Type: `200 (Rewrite)`

### ❌ Build Fails
**Debug:**
1. Check build logs in Amplify Console
2. Test build locally: `npm run build`
3. Verify `amplify.yml` is committed
4. Ensure all dependencies are in `package.json`

---

## 📂 Files You Need

- ✅ `amplify.yml` - Build configuration (created)
- ✅ `env.template` - Environment variable template (created)
- ✅ `DEPLOYMENT_GUIDE.md` - Detailed guide (created)
- ⚠️ `.env.local` - Local development only (create from template)

---

## 🔄 Update Deployment

### Code Changes
```bash
git add .
git commit -m "Update code"
git push origin main
# AWS Amplify auto-deploys
```

### Environment Variable Changes
1. Amplify Console → **Environment variables**
2. Update variables
3. Click **"Save"**
4. **"Redeploy this version"** (important!)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│         AWS Amplify (Frontend)          │
│    https://yourapp.amplifyapp.com       │
│                                          │
│  React App (Vite + TypeScript)         │
│  ├─ AuthContext (user state)           │
│  ├─ Grid.tsx (timesheet UI)            │
│  └─ Services:                           │
│     ├─ authAPI.ts                       │
│     └─ timesheetAPI.ts                  │
└─────────────┬───────────────────────────┘
              │
              │ HTTPS Requests
              │
┌─────────────▼───────────────────────────┐
│      Your Backend (Deployed)            │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Auth Service (Port 3002)      │    │
│  │  /auth-service/*               │    │
│  └────────────────────────────────┘    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Save Service (Port 3000)      │    │
│  │  /save-service/*               │    │
│  └────────────────────────────────┘    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Submit Service (Port 3001)    │    │
│  │  /submit-service/*             │    │
│  └────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
              ▼
         ┌─────────┐
         │ MongoDB │
         └─────────┘
```

---

## ✅ Deployment Checklist

**Before Deployment:**
- [ ] Backend services deployed and accessible via HTTPS
- [ ] Backend CORS configured for Amplify domain
- [ ] Code committed and pushed to Git
- [ ] `amplify.yml` exists in repository root

**During Deployment:**
- [ ] Connected Git repository to AWS Amplify
- [ ] Selected correct branch
- [ ] Added environment variables
- [ ] Verified build settings

**After Deployment:**
- [ ] Tested authentication flow
- [ ] Tested timesheet save/submit operations
- [ ] Checked browser console for errors
- [ ] Verified API calls reach backend
- [ ] Added rewrite rules for client-side routing
- [ ] (Optional) Configured custom domain

---

## 💡 Pro Tips

1. **Branch-based Deployments**: Create separate Amplify apps for `dev`, `staging`, and `production` branches

2. **Password Protection**: Enable password protection for preview deployments in Amplify settings

3. **Performance**: AWS Amplify uses CloudFront CDN automatically for fast global delivery

4. **Monitoring**: Check Amplify Console → **Monitoring** for traffic and errors

5. **Cost**: Most small apps stay within free tier ($0/month)

6. **Environment per Branch**: Set different `VITE_BACKEND_URL` for each branch deployment

---

## 📚 Additional Resources

- **Detailed Guide**: See `DEPLOYMENT_GUIDE.md` for comprehensive instructions
- **Backend Integration**: See `BACKEND_INTEGRATION.md` for API details
- **AWS Amplify Docs**: https://docs.aws.amazon.com/amplify/

---

**Need Help?** 
1. Check build logs in Amplify Console
2. Review browser console (F12)
3. Verify backend is accessible
4. Check environment variables

