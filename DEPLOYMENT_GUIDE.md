# Vercel Deployment Guide

## Fixed Issues

✅ All deployment errors have been resolved with the following changes:

### 1. Added `vercel.json` Configuration
- Properly configured builds for both client and server
- Set up routing for API endpoints and static files
- Configured environment variables

### 2. Updated `server/index.js`
- Exported Express app for Vercel serverless functions
- Conditional server start (only in development)
- Added `module.exports = app` for Vercel compatibility

### 3. Added Build Script
- Updated `client/package.json` with `vercel-build` script
- Ensures proper production build

## Deployment Steps

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `tradingmatrix` repository

### Step 2: Configure Environment Variables

In Vercel project settings, add these environment variables:

```
ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
NODE_ENV=production
```

**How to add:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable:
   - Name: `ALPHA_VANTAGE_API_KEY`
   - Value: Your Alpha Vantage API key
   - Environment: Production, Preview, Development (select all)

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

## Project Structure for Vercel

```
tradingmatrix/
├── vercel.json              ← Deployment configuration
├── server/
│   └── index.js            ← Exports app for serverless
├── client/
│   ├── dist/               ← Built files (auto-generated)
│   └── package.json        ← Has vercel-build script
└── .env.example            ← Template for environment variables
```

## API Routes

After deployment, your API will be available at:
- `https://your-project.vercel.app/api/health`
- `https://your-project.vercel.app/api/trend-matrix/:symbol`
- `https://your-project.vercel.app/api/symbols`

Frontend will be served from:
- `https://your-project.vercel.app/`

## Common Issues & Solutions

### Issue: FUNCTION_INVOCATION_TIMEOUT
**Solution:** 
- Go to Project Settings → Functions
- Increase timeout to 60 seconds
- This is needed for API data fetching

### Issue: Missing Environment Variables
**Solution:**
- Verify `ALPHA_VANTAGE_API_KEY` is set in Vercel dashboard
- Redeploy after adding variables

### Issue: CORS Errors
**Solution:**
- Already fixed in `server/index.js` with proper CORS configuration
- If issues persist, check Vercel logs

### Issue: Build Failures
**Solution:**
- Ensure Node.js version is 18+ in Vercel settings
- Check build logs for specific errors
- Run `npm run build` locally to test

## Monitoring Deployment

1. **Check Logs:**
   - Go to your deployment
   - Click "View Function Logs"
   - Monitor for errors

2. **Test Endpoints:**
   ```bash
   # Health check
   curl https://your-project.vercel.app/api/health
   
   # Get trend matrix for AAPL
   curl https://your-project.vercel.app/api/trend-matrix/AAPL
   ```

3. **Check Performance:**
   - Vercel Dashboard → Analytics
   - Monitor function execution time
   - Check error rates

## Updating Deployment

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically detect the push and redeploy.

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Wait for DNS propagation (up to 24 hours)

## Performance Tips

1. **API Caching:**
   - Alpha Vantage free tier: 25 calls/day
   - Consider implementing Redis caching for production

2. **Edge Functions:**
   - Already optimized for Vercel Edge Network
   - Low latency worldwide

3. **Build Optimization:**
   - Vite automatically optimizes bundle size
   - Tree-shaking enabled by default

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review GitHub repository issues
3. Verify environment variables are set
4. Test API endpoints individually

## Next Steps After Deployment

1. ✅ Verify all endpoints work
2. ✅ Test with different stock symbols
3. ✅ Monitor API usage (Alpha Vantage limits)
4. ✅ Set up custom domain (optional)
5. ✅ Configure monitoring/alerts

---

**Your project is now ready for Vercel deployment!** 🚀

The configuration files have been committed and pushed to GitHub.
Simply connect your repository to Vercel and follow the steps above.
