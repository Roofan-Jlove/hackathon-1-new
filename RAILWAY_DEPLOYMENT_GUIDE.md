# Railway Deployment Guide - Backend

This guide will help you deploy your FastAPI backend to Railway.

## What is Railway?

**Railway** is a modern cloud platform that makes it easy to deploy applications:
- ✅ **Free Tier**: 500 hours/month (about $5 worth)
- ✅ **Great for Python**: Built-in support for FastAPI, Django, Flask
- ✅ **More Memory**: Better for ML/AI apps with heavy dependencies
- ✅ **Easy Setup**: Deploy from GitHub in minutes
- ✅ **Auto Deploy**: Automatic deployments on git push

**Perfect for:** Backends with heavy dependencies like ML models, langchain, etc.

---

## Prerequisites

✅ GitHub account with your code pushed
✅ Your environment variables ready (from `.env` file)

---

## Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** (top right)
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. ✅ You're now logged in!

### Step 2: Create a New Project

1. On Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your repositories
4. Search for **"hackathon-1-new"**
5. Click on it to select

### Step 3: Configure the Service

After selecting your repo:

1. Railway will ask **"Select a service to deploy"**
2. Choose **"backend"** folder (if it asks for root directory)
3. Railway will auto-detect it's a Python project ✅

### Step 4: Add Environment Variables

This is the most important step!

1. Click on your deployed service (shows the name "backend" or "hackathon-1-new")
2. Go to the **"Variables"** tab
3. Click **"New Variable"** and add each one:

**Add these 7 variables:**

| Variable Name | Value (from your backend/.env file) |
|---------------|-------------------------------------|
| `OPENAI_API_KEY` | Copy from your `.env` file |
| `NEON_DATABASE_URL` | Copy from your `.env` file |
| `QDRANT_URL` | Copy from your `.env` file |
| `QDRANT_API_KEY` | Copy from your `.env` file |
| `SECRET_KEY` | Copy from your `.env` file |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |

**How to add each variable:**
```
┌─────────────────────────────────────┐
│  Variable Name                      │
│  ┌───────────────────────────────┐  │
│  │ OPENAI_API_KEY                │  │
│  └───────────────────────────────┘  │
│                                     │
│  Variable Value                     │
│  ┌───────────────────────────────┐  │
│  │ sk-proj-FXdUfu9Mhiv7Y...      │  │
│  └───────────────────────────────┘  │
│                                     │
│        [Add]                        │
└─────────────────────────────────────┘
```

4. Click **"Add"** after each variable
5. Repeat for all 7 variables

### Step 5: Configure Root Directory (Important!)

1. Go to **"Settings"** tab
2. Scroll down to **"Root Directory"**
3. Set it to: **`backend`**
4. Click **"Save"**

### Step 6: Deploy!

After adding all environment variables and setting root directory:

1. Railway will **automatically start building**
2. You'll see build logs in real-time
3. Look for these stages:
   - 🟡 **Building** - Installing dependencies (5-10 minutes first time)
   - 🟡 **Deploying** - Starting the server
   - 🟢 **Active** - Live and running! ✅

### Step 7: Get Your Backend URL

Once deployment is complete:

1. Go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. Railway will give you a URL like:
   ```
   https://hackathon-1-new-production.up.railway.app
   ```
5. **Copy this URL** - you'll need it for the frontend!

### Step 8: Test Your Backend

Open your Railway URL in a browser and add `/health`:
```
https://your-app.up.railway.app/health
```

You should see:
```json
{"status": "ok"}
```

✅ **Backend is live!**

---

## Understanding Railway Dashboard

### Tabs Explained:

1. **Deployments** 🚀
   - Shows all deployments
   - View build logs
   - Check deployment status

2. **Variables** ⚙️
   - Manage environment variables
   - Add/edit/delete variables

3. **Settings** 🛠️
   - Configure root directory
   - Set up custom domains
   - Manage GitHub connection

4. **Metrics** 📊
   - View CPU/Memory usage
   - Monitor your app performance

5. **Logs** 📝
   - Real-time application logs
   - Debug errors
   - See API requests

---

## Troubleshooting

### Issue: Build Failed

**Check:**
1. Build logs for specific error
2. Ensure `requirements.txt` has all dependencies
3. Verify Python version compatibility

**Solution:**
- Go to Deployments → Click failed deployment → View logs
- Fix the error in your code
- Push to GitHub → Railway auto-redeploys

### Issue: Environment Variables Not Working

**Solution:**
1. Go to Variables tab
2. Check all 7 variables exist
3. Click "Redeploy" after adding variables

### Issue: App Crashed / Not Responding

**Check Logs:**
1. Go to "Logs" tab (top navigation)
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Database connection failed
   - Port binding error

**Solution:**
- Ensure all environment variables are set
- Check database URL is correct
- Railway automatically uses $PORT variable

### Issue: Out of Free Credits

Railway free tier includes:
- $5 worth of usage/month
- ~500 hours of runtime

**Solution:**
- Add payment method (only charged if you exceed free tier)
- Or optimize your app to use less resources

---

## Monitoring Your App

### Check if App is Running:

```bash
# Test health endpoint
curl https://your-app.up.railway.app/health

# Expected response:
{"status":"ok"}
```

### View Real-time Logs:

1. Railway Dashboard → Your Project
2. Click "Logs" tab (top)
3. See real-time output

### Monitor Usage:

1. Click "Metrics" tab
2. View:
   - CPU usage
   - Memory usage
   - Network traffic

---

## Continuous Deployment

**Automatic Deployments:**
- ✅ Push to GitHub → Railway auto-deploys
- ✅ New commits trigger rebuilds
- ✅ Zero downtime deployments

**Manual Deploy:**
1. Go to Deployments
2. Click "Deploy"
3. Select branch to deploy

---

## Next Steps After Backend Deployment

1. ✅ Backend deployed on Railway
2. ⏳ Copy your Railway backend URL
3. ⏳ Update frontend Vercel project with backend URL:
   - Add environment variable: `DOCUSAURUS_BACKEND_API_URL`
   - Value: Your Railway URL
4. ⏳ Redeploy frontend on Vercel
5. 🎉 Full stack app is live!

---

## Comparing Railway vs Vercel

| Feature | Railway (Backend) | Vercel (Frontend) |
|---------|------------------|-------------------|
| **Best For** | APIs, Backends, Databases | Static sites, SPAs |
| **Free Tier** | $5/month (~500 hrs) | Unlimited |
| **Memory** | Up to 8GB | 1GB (serverless) |
| **Build Time** | No limit | 45 seconds |
| **Heavy Dependencies** | ✅ Yes | ❌ No |
| **Databases** | ✅ Built-in | ❌ External only |

**Conclusion:** Railway + Vercel = Perfect combo for fullstack apps! 🚀

---

## Support & Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)

---

**Ready to deploy?** Follow the steps above and your backend will be live in ~10 minutes! 🎉
