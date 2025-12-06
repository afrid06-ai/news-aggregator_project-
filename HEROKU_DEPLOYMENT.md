# Heroku Deployment Guide

Complete step-by-step guide to deploy your News Aggregator backend to Heroku.

## Why Heroku?

- ⚡ **Faster deployments** (2-5 minutes vs 5-10 on Render)
- 🚀 **More reliable** for Node.js apps
- 📊 **Better dashboard** and monitoring
- 🔄 **Easy rollbacks** if something goes wrong
- 💰 **Free tier available** (with limitations)

## Prerequisites

- GitHub repository with code pushed
- Heroku account (sign up at https://heroku.com)
- Heroku CLI installed (or use web interface)

## Method 1: Deploy via Heroku CLI (Recommended - Faster)

### Step 1: Install Heroku CLI

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Or download from:** https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Login to Heroku

```bash
heroku login
```

This will open a browser window for authentication.

### Step 3: Create Heroku App

```bash
cd /Users/afridshaik/Downloads/FinalProject/Afrid_shaik_node
heroku create news-aggregator-backend
```

(Replace `news-aggregator-backend` with your preferred name, or Heroku will generate one)

### Step 4: Set Environment Variables

```bash
heroku config:set MONGODB_URI="mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority"

heroku config:set NEWS_API_KEY="70b2c376186d499f8a0cd40c5cd474d3"
```

### Step 5: Set Buildpack (Important!)

Since your code is in a subdirectory, we need to configure Heroku:

```bash
heroku config:set PROJECT_PATH="Afrid_shaik_node"
```

Or use a buildpack that handles monorepos:

```bash
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
heroku config:set PROJECT_PATH="Afrid_shaik_node"
```

### Step 6: Deploy

**Option A: Deploy from GitHub (Recommended)**

1. Go to https://dashboard.heroku.com
2. Select your app
3. Go to "Deploy" tab
4. Connect your GitHub repository
5. Select `news-aggregator_project-` repository
6. Enable "Wait for CI to pass before deploy" (optional)
7. Click "Deploy Branch" (select `main` branch)
8. Wait 2-5 minutes

**Option B: Deploy via Git**

```bash
cd /Users/afridshaik/Downloads/FinalProject
git subtree push --prefix Afrid_shaik_node heroku main
```

Or if that doesn't work:

```bash
cd /Users/afridshaik/Downloads/FinalProject/Afrid_shaik_node
git init
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a your-app-name
git push heroku main
```

### Step 7: Verify Deployment

```bash
heroku open
```

Or visit: `https://your-app-name.herokuapp.com`

## Method 2: Deploy via Heroku Dashboard (Easier - No CLI)

### Step 1: Create App via Dashboard

1. Go to https://dashboard.heroku.com
2. Click "New" → "Create new app"
3. Enter app name: `news-aggregator-backend` (or any available name)
4. Choose region: `United States` (or closest to you)
5. Click "Create app"

### Step 2: Connect GitHub

1. Go to "Deploy" tab
2. Under "Deployment method", select "GitHub"
3. Click "Connect to GitHub"
4. Authorize Heroku to access your repositories
5. Search for: `news-aggregator_project-`
6. Click "Connect" next to your repository

### Step 3: Configure Deployment

1. **Branch to deploy**: Select `main`
2. **Enable Automatic Deploys**: Toggle ON (optional - auto-deploys on push)
3. **Wait for CI to pass**: Toggle OFF (unless you have CI)

### Step 4: Set Environment Variables

1. Go to "Settings" tab
2. Click "Reveal Config Vars"
3. Add these variables:

   **Variable 1:**
   - KEY: `MONGODB_URI`
   - VALUE: `mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority`
   - Click "Add"

   **Variable 2:**
   - KEY: `NEWS_API_KEY`
   - VALUE: `70b2c376186d499f8a0cd40c5cd474d3`
   - Click "Add"

### Step 5: Configure Buildpack for Subdirectory

Since your backend is in `Afrid_shaik_node` subdirectory:

1. Go to "Settings" tab
2. Scroll to "Buildpacks"
3. Click "Add buildpack"
4. Enter: `https://github.com/timanovsky/subdir-heroku-buildpack`
5. Click "Save changes"
6. Go back to "Settings" → "Config Vars"
7. Add variable:
   - KEY: `PROJECT_PATH`
   - VALUE: `Afrid_shaik_node`
   - Click "Add"

### Step 6: Deploy

1. Go to "Deploy" tab
2. Scroll to "Manual deploy"
3. Select branch: `main`
4. Click "Deploy Branch"
5. Watch the build logs
6. Wait 2-5 minutes for deployment

### Step 7: Verify

1. Once deployed, click "Open app" button
2. Or visit: `https://your-app-name.herokuapp.com`
3. Test portfolio: `https://your-app-name.herokuapp.com/`
4. Test API: `https://your-app-name.herokuapp.com/api`

## Deployment Time Comparison

| Platform | First Deploy | Subsequent Deploys |
|----------|-------------|-------------------|
| **Heroku** | 2-5 minutes | 1-3 minutes |
| **Render** | 5-10 minutes | 3-5 minutes |

**Heroku is typically faster!** ⚡

## Troubleshooting

### Build Fails - "No app.json or Procfile found"

**Solution:** Use the subdir buildpack:
```bash
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
heroku config:set PROJECT_PATH="Afrid_shaik_node"
```

### App Crashes on Start

1. Check logs: `heroku logs --tail`
2. Verify environment variables are set
3. Check MongoDB connection string
4. Verify Procfile exists and is correct

### MongoDB Connection Fails

1. Check MONGODB_URI is set correctly
2. Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. Check credentials in connection string

### Port Issues

Heroku sets PORT automatically. Your code already handles this:
```javascript
const PORT = process.env.PORT || 3000;
```

This is correct! ✅

## View Logs

### Via CLI:
```bash
heroku logs --tail
```

### Via Dashboard:
1. Go to your app
2. Click "More" → "View logs"

## Common Commands

```bash
# View app info
heroku info

# View config vars
heroku config

# Set config var
heroku config:set KEY=value

# View logs
heroku logs --tail

# Restart app
heroku restart

# Open app in browser
heroku open

# Run commands in dyno
heroku run bash
```

## Heroku Free Tier Limitations

- **Sleeps after 30 minutes** of inactivity (vs 15 min on Render)
- **550-1000 hours/month** free dyno hours
- **No custom domains** on free tier
- **Slower cold starts** after sleep

## Upgrade to Paid Plan

If you need:
- **Always-on** (no sleep)
- **Custom domains**
- **More resources**

Upgrade to **Hobby ($7/month)** or **Standard plans**.

## After Deployment

Once your backend is live on Heroku:

1. **Get your URL**: `https://your-app-name.herokuapp.com`
2. **Update frontend** to use this URL
3. **Test all endpoints**
4. **Share your portfolio URL**!

## Quick Deployment Checklist

- [ ] Heroku account created
- [ ] App created (via CLI or dashboard)
- [ ] GitHub repository connected
- [ ] Subdir buildpack added (for monorepo)
- [ ] PROJECT_PATH config var set to `Afrid_shaik_node`
- [ ] MONGODB_URI config var set
- [ ] NEWS_API_KEY config var set
- [ ] Branch deployed
- [ ] App is "Live"
- [ ] Tested portfolio URL
- [ ] Tested API endpoints

## Your Heroku URLs

After deployment, you'll have:

- **Portfolio**: `https://your-app-name.herokuapp.com/`
- **API Base**: `https://your-app-name.herokuapp.com/api`
- **Get Articles**: `https://your-app-name.herokuapp.com/api`
- **Search**: `https://your-app-name.herokuapp.com/api/search/:query`
- **News Headlines**: `https://your-app-name.herokuapp.com/api/news/headlines`
- **News Search**: `https://your-app-name.herokuapp.com/api/news/search`

## Next Steps

1. ✅ Deploy backend to Heroku (2-5 minutes)
2. ✅ Get your Heroku URL
3. ✅ Update frontend API URLs
4. ✅ Test everything works
5. ✅ Share your portfolio!

---

**Heroku deployment is faster than Render! 🚀**

**Typical time: 2-5 minutes** (vs 5-10 on Render)

