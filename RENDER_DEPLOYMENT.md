# Render Deployment Guide

Complete step-by-step guide to deploy your News Aggregator backend to Render.

## Prerequisites

- GitHub repository with your code pushed
- Render account (sign up at https://render.com)
- MongoDB connection string
- NewsAPI key

## Step 1: Sign Up / Login to Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up using your GitHub account (recommended for easy repo connection)

## Step 2: Create New Web Service

1. Once logged in, click the **"New +"** button in the top right
2. Select **"Web Service"** from the dropdown menu
3. You'll be prompted to connect your GitHub account if not already connected
4. Authorize Render to access your repositories

## Step 3: Connect Your Repository

1. In the repository list, find and select: **`news-aggregator_project-`**
2. Click **"Connect"** next to your repository

## Step 4: Configure the Service

Fill in the following settings **EXACTLY** as shown:

### Basic Settings

1. **Source Code**: 
   - Should already show: `afrid06-ai / news-aggregator_project-`
   - If not, click "Edit" and select your repository

2. **Name**: 
   - Pre-filled: `news-aggregator_project-`
   - You can keep this or change to: `news-aggregator-backend`

3. **Project (Optional)**: 
   - Leave as: `No project`
   - Environment: `No environment`

4. **Language**: 
   - Should be pre-selected: `Node`
   - If not, select `Node` from dropdown

5. **Branch**: 
   - Pre-filled: `main`
   - Keep this value

6. **Region**: 
   - Select: `Oregon (US West)` (purple button)
   - Or choose region closest to you

7. **Root Directory** ⚠️ **CRITICAL - MUST FILL THIS!**:
   - **Value**: `Afrid_shaik_node`
   - This tells Render where your backend code is located
   - Without this, deployment will fail!

8. **Build Command**: 
   - **Change from**: `$ yarn` (default)
   - **To**: `npm install`
   - This installs all dependencies

9. **Start Command**: 
   - **Change from**: `$ yarn start` (default)
   - **To**: `npm start`
   - This starts your Node.js server

10. **Instance Type**: 
    - Select: `Free` (purple box showing "$0 / month")
    - This is fine for testing
    - Note: Free tier spins down after 15 min inactivity

### Advanced Settings (Optional)

- **Auto-Deploy**: `Yes` (automatically deploys on git push)
- **Health Check Path**: Leave empty (or use `/api`)

## Step 5: Add Environment Variables

Scroll down to the **"Environment Variables"** section and add these variables:

### How to Add Variables:

1. Click in the left field (placeholder: "NAME_OF_VARIABLE")
2. Type the variable name
3. Click in the right field (placeholder: "value")
4. Type the variable value
5. Click **"+ Add Environment Variable"** to add more

### Required Variables (Add These):

**Variable 1:**
- **Name (left field)**: `MONGODB_URI`
- **Value (right field)**: `mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority`
- Click **"+ Add Environment Variable"** after entering

**Variable 2:**
- **Name (left field)**: `NEWS_API_KEY`
- **Value (right field)**: `70b2c376186d499f8a0cd40c5cd474d3`
- Click **"+ Add Environment Variable"** after entering

### Optional Variables (Not Required):

**Variable 3 (Optional):**
- **Name**: `NODE_ENV`
- **Value**: `production`

**Variable 4 (Optional - Usually Not Needed):**
- **Name**: `PORT`
- **Value**: Leave empty (Render sets this automatically)

### Final Check:
You should see 2 variables listed:
1. ✅ MONGODB_URI
2. ✅ NEWS_API_KEY

## Step 6: Review and Deploy

### Before Clicking Deploy, Verify:

✅ **Source Code**: `afrid06-ai / news-aggregator_project-`  
✅ **Name**: `news-aggregator_project-` (or your preferred name)  
✅ **Language**: `Node`  
✅ **Branch**: `main`  
✅ **Region**: `Oregon (US West)` (or your region)  
✅ **Root Directory**: `Afrid_shaik_node` ⚠️ **MUST BE SET!**  
✅ **Build Command**: `npm install`  
✅ **Start Command**: `npm start`  
✅ **Instance Type**: `Free` selected  
✅ **Environment Variables**: 
   - `MONGODB_URI` = (your connection string)
   - `NEWS_API_KEY` = (your API key)

### Deploy:

1. Scroll down to the bottom of the page
2. You'll see a large button: **"Deploy Web Service"**
3. Click **"Deploy Web Service"**
4. Render will start building and deploying your application
5. You'll be redirected to the service dashboard
6. Watch the build logs in real-time
7. Wait 2-5 minutes for the deployment to complete
8. Status will change from "Building" → "Deploying" → "Live" ✅

## Step 7: Verify Deployment

Once deployment is complete:

1. You'll see a green "Live" status
2. Your service URL will be displayed (e.g., `https://news-aggregator-backend.onrender.com`)

### Test Your Endpoints

- **Portfolio**: `https://your-app-name.onrender.com/`
- **API**: `https://your-app-name.onrender.com/api`
- **Health Check**: `https://your-app-name.onrender.com/api` (should return articles array)

## Step 8: Update Frontend (After Backend is Deployed)

Once your backend is live, update the frontend to use the deployed URL:

1. **Update `Afrid_shaik_vue/src/App.vue`**:
   ```javascript
   apiUrl: 'https://your-app-name.onrender.com/api',
   ```

2. **Update `Afrid_shaik_vue/src/components/ArticleList.vue`**:
   ```javascript
   default: 'https://your-app-name.onrender.com/api'
   ```

3. **Update `Afrid_shaik_vue/src/components/ArticleCard.vue`**:
   ```javascript
   default: 'https://your-app-name.onrender.com/api'
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

## Troubleshooting

### Build Fails

- **Check logs**: Click on "Logs" tab to see error messages
- **Verify Root Directory**: Make sure it's set to `Afrid_shaik_node`
- **Check package.json**: Ensure all dependencies are listed
- **Node version**: Render uses Node 18 by default (should work fine)

### Service Won't Start

- **Check environment variables**: Make sure MONGODB_URI and NEWS_API_KEY are set
- **Check Start Command**: Should be `npm start`
- **Check logs**: Look for MongoDB connection errors

### 502 Bad Gateway

- **Wait a moment**: Free tier services spin down after inactivity
- **First request**: May take 30-60 seconds to wake up
- **Check service status**: Make sure it shows "Live"

### MongoDB Connection Issues

- **Verify connection string**: Check MONGODB_URI is correct
- **Check MongoDB Atlas**: Ensure IP whitelist allows all IPs (0.0.0.0/0)
- **Check credentials**: Verify username and password in connection string

### CORS Issues

- **Backend already has CORS enabled**: Should work out of the box
- **If issues persist**: Check that `cors` package is installed

## Render Free Tier Limitations

- **Spins down after 15 minutes** of inactivity
- **First request** after spin-down takes 30-60 seconds
- **Limited resources**: May be slower than paid plans
- **Auto-deploy**: Still works on free tier

## Upgrading to Paid Plan

If you need:
- **Always-on service** (no spin-down)
- **Faster response times**
- **More resources**

Upgrade to **Starter plan ($7/month)** in the Render dashboard.

## Monitoring Your Service

### View Logs

1. Click on your service in Render dashboard
2. Go to "Logs" tab
3. See real-time logs and errors

### View Metrics

1. Go to "Metrics" tab
2. See CPU, Memory, and Request metrics
3. Monitor performance

## Auto-Deploy from GitHub

Render automatically deploys when you push to your main branch:

1. Make changes locally
2. Commit: `git commit -m "Your changes"`
3. Push: `git push`
4. Render detects the push
5. Automatically rebuilds and redeploys
6. You'll see the new deployment in the dashboard

## Environment Variables Best Practices

### For Production

Consider using Render's environment variable encryption:
1. Go to Environment tab
2. Variables are automatically encrypted
3. Never commit sensitive keys to GitHub

### Update Variables

1. Go to your service dashboard
2. Click "Environment" tab
3. Edit or add variables
4. Click "Save Changes"
5. Service will automatically restart with new variables

## Next Steps

After backend is deployed:

1. ✅ Test all API endpoints
2. ✅ Update frontend API URLs
3. ✅ Test frontend with deployed backend
4. ✅ (Optional) Deploy frontend to Render Static Site or Vercel

## Support

- **Render Docs**: https://render.com/docs
- **Render Support**: https://render.com/support
- **Check Service Logs**: Always check logs first for errors

## Quick Reference

### Your Service URL Format
```
https://news-aggregator_project-.onrender.com
```
(Or whatever name you chose)

### Important Paths
- **Portfolio**: `https://your-app-name.onrender.com/`
- **API Base**: `https://your-app-name.onrender.com/api`
- **Get Articles**: `https://your-app-name.onrender.com/api`
- **Search**: `https://your-app-name.onrender.com/api/search/:query`
- **News Headlines**: `https://your-app-name.onrender.com/api/news/headlines`
- **News Search**: `https://your-app-name.onrender.com/api/news/search`

## Complete Configuration Summary

Here's everything you need to fill in one place:

| Field | Value |
|-------|-------|
| **Source Code** | `afrid06-ai / news-aggregator_project-` |
| **Name** | `news-aggregator_project-` |
| **Project** | `No project` |
| **Language** | `Node` |
| **Branch** | `main` |
| **Region** | `Oregon (US West)` |
| **Root Directory** | `Afrid_shaik_node` ⚠️ |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |
| **MONGODB_URI** | `mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority` |
| **NEWS_API_KEY** | `70b2c376186d499f8a0cd40c5cd474d3` |

### Commands Reference

**Local Testing:**
```bash
cd Afrid_shaik_node
npm install
npm start
```

**Deploy to Render:**
- Just push to GitHub (if auto-deploy enabled)
- Or manually trigger from Render dashboard

---

**Happy Deploying! 🚀**

