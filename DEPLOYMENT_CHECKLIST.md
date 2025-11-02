# AWS Amplify Deployment Checklist

Use this checklist to ensure a smooth deployment to AWS Amplify.

## Pre-Deployment

### Backend Preparation
- [ ] All backend services are deployed and running
- [ ] Backend services are accessible via HTTPS
- [ ] Note down your backend URLs:
  - Save Service URL: `_____________________________`
  - Submit Service URL: `_____________________________`
  - Auth Service URL: `_____________________________`
- [ ] Backend has CORS enabled
- [ ] MongoDB is configured and accessible
- [ ] Test backend endpoints with Postman/curl

### Frontend Preparation
- [ ] All code changes are committed
- [ ] Code is pushed to Git repository (GitHub/GitLab/Bitbucket)
- [ ] `amplify.yml` exists in repository root
- [ ] `env.template` exists for reference
- [ ] Local build works: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] All tests pass (if applicable)

### AWS Setup
- [ ] AWS account created
- [ ] AWS Amplify access configured
- [ ] Billing alerts set up (optional but recommended)

## During Deployment

### AWS Amplify Configuration
- [ ] Connected Git repository to AWS Amplify
- [ ] Selected correct branch (e.g., `main`)
- [ ] Build settings detected `amplify.yml`
- [ ] Added environment variables:
  - [ ] `VITE_BACKEND_URL` = `_____________________________`
  - [ ] `VITE_AUTH_SERVICE_URL` = `_____________________________`
- [ ] Verified environment variable names start with `VITE_`
- [ ] Clicked "Save and deploy"
- [ ] Monitoring build progress
- [ ] Build completed successfully
- [ ] Note down Amplify URL: `_____________________________`

## Post-Deployment

### Backend CORS Update
- [ ] Updated backend CORS to allow Amplify domain
- [ ] Added Amplify URL to CORS origin list:
  ```javascript
  origin: [
    'https://main.d1234abcd.amplifyapp.com'  // Your Amplify URL
  ]
  ```
- [ ] Restarted backend services after CORS update

### Testing
- [ ] Open Amplify URL in browser
- [ ] Test Sign Up page (`/signup`)
  - [ ] Can create new account
  - [ ] Redirects to timesheet grid after registration
- [ ] Test Sign In page (`/signin`)
  - [ ] Can log in with credentials
  - [ ] Redirects to timesheet grid after login
- [ ] Test Timesheet Grid (`/grid`)
  - [ ] Week navigation works (previous/next)
  - [ ] Can edit billable hours
  - [ ] Can edit non-billable hours
  - [ ] Can toggle WFH status
  - [ ] Save button works (check browser console)
  - [ ] Submit button works (check browser console)
- [ ] Check browser console (F12)
  - [ ] No errors visible
  - [ ] API calls succeed (200 responses)
- [ ] Check Network tab
  - [ ] API calls go to correct backend URLs
  - [ ] No CORS errors
  - [ ] JWT tokens are sent in headers

### Client-Side Routing
- [ ] Test page refresh on different routes
- [ ] If 404 errors occur, add rewrite rule:
  - Navigate to Amplify Console → Rewrites and redirects
  - Add rule: Source `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
  - Target: `/index.html`
  - Type: `200 (Rewrite)`

### Performance & Security
- [ ] App loads quickly
- [ ] PWA manifest loads correctly
- [ ] HTTPS enabled (automatic with Amplify)
- [ ] Environment variables not exposed in browser
- [ ] JWT tokens stored securely (localStorage)

## Optional Enhancements

### Custom Domain
- [ ] Purchase/own domain name
- [ ] Add domain in Amplify Console → Domain management
- [ ] Update DNS records
- [ ] Wait for SSL certificate provisioning
- [ ] Test custom domain
- [ ] Update backend CORS with custom domain

### Monitoring
- [ ] Set up CloudWatch alarms
- [ ] Configure email notifications for build failures
- [ ] Enable Amplify monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

### Multiple Environments
- [ ] Create `dev` branch deployment
- [ ] Create `staging` branch deployment
- [ ] Configure different environment variables per branch
- [ ] Test promotion flow: dev → staging → production

### Security
- [ ] Enable password protection for preview deployments
- [ ] Review IAM permissions
- [ ] Set up AWS WAF (optional)
- [ ] Configure CSP headers (optional)

## Troubleshooting

If anything goes wrong, check:

### Build Failures
- [ ] Review build logs in Amplify Console
- [ ] Check for missing dependencies
- [ ] Verify `amplify.yml` syntax
- [ ] Test `npm run build` locally

### Runtime Errors
- [ ] Check browser console for errors
- [ ] Verify environment variables are set correctly
- [ ] Check Network tab for API failures
- [ ] Verify backend is running and accessible

### CORS Errors
- [ ] Backend CORS includes Amplify domain
- [ ] CORS allows credentials
- [ ] Backend services restarted after CORS update

### API Connection Issues
- [ ] Backend URLs are correct
- [ ] Backend is using HTTPS (not HTTP)
- [ ] Environment variables use `VITE_` prefix
- [ ] App was redeployed after env var changes

## Continuous Deployment

- [ ] Configure branch-based deployments
- [ ] Test auto-deploy on push
- [ ] Set up pull request previews
- [ ] Configure build notifications

## Documentation

- [ ] Update README with production URL
- [ ] Document deployment process for team
- [ ] Create runbook for common issues
- [ ] Share Amplify URL with stakeholders

## Sign-Off

- [ ] All tests passed
- [ ] Stakeholders notified
- [ ] Documentation updated
- [ ] Monitoring configured
- [ ] Deployment notes recorded

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Amplify URL**: _______________

**Backend URLs**:
- Auth: _______________
- Save: _______________
- Submit: _______________

**Notes**:
_________________________________________
_________________________________________
_________________________________________

---

## Quick Reference

**Next time you deploy:**
1. Push code to Git
2. AWS Amplify auto-deploys
3. Check build logs
4. Test in browser

**To update environment variables:**
1. Amplify Console → Environment variables
2. Update values
3. Click "Redeploy this version"

**For help:**
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- See [AWS_AMPLIFY_QUICKSTART.md](AWS_AMPLIFY_QUICKSTART.md)
- Check AWS Amplify documentation


