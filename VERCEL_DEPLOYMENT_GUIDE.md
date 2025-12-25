# Vercel Deployment Guide

This guide will help you deploy both the frontend (Docusaurus) and backend (FastAPI) to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): Install with `npm i -g vercel`
3. **GitHub Repository**: Ensure your code is pushed to GitHub

## Project Structure

```
hackathon-1-new/
├── frontend/           # Docusaurus frontend
│   ├── vercel.json    # Frontend Vercel config
│   └── ...
├── backend/            # FastAPI backend
│   ├── vercel.json    # Backend Vercel config
│   ├── .env.example   # Environment variables template
│   └── ...
└── README.md
```

## Deployment Strategy

We'll deploy the frontend and backend as **two separate Vercel projects**:
1. **Frontend Project**: Docusaurus static site
2. **Backend Project**: FastAPI serverless functions

---

## Part 1: Deploy Backend (FastAPI)

### Step 1: Prepare Environment Variables

You'll need the following environment variables. Copy them from your `.env` file or set them up:

- `OPENAI_API_KEY` - Your OpenAI API key
- `NEON_DATABASE_URL` - PostgreSQL database connection string
- `QDRANT_URL` - Qdrant vector database URL
- `QDRANT_API_KEY` - Qdrant API key
- `SECRET_KEY` - JWT secret key (generate a secure random string)
- `ALGORITHM` - JWT algorithm (use "HS256")
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time (e.g., "30")

### Step 2: Deploy Backend to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Configure Project**:
   - **Project Name**: `hackathon-1-backend` (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add each variable from the list above
   - Use the format: `Key` = `OPENAI_API_KEY`, `Value` = `your_actual_api_key`
5. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
cd backend
vercel --prod
# Follow the prompts and add environment variables when asked
```

### Step 3: Note Your Backend URL

After deployment, you'll get a URL like:
```
https://hackathon-1-backend.vercel.app
```

**Save this URL** - you'll need it for the frontend configuration.

---

## Part 2: Deploy Frontend (Docusaurus)

### Step 1: Update Frontend Environment Variable

Before deploying the frontend, you need to set the backend API URL.

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository again
3. **Configure Project**:
   - **Project Name**: `hackathon-1-frontend` (or your choice)
   - **Framework Preset**: Docusaurus
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add: `DOCUSAURUS_BACKEND_API_URL` = `https://your-backend-url.vercel.app`
   - Replace with your actual backend URL from Part 1, Step 3
5. Click **Deploy**

#### Option B: Using Vercel CLI

```bash
cd frontend
vercel --prod
# Add environment variable when prompted:
# DOCUSAURUS_BACKEND_API_URL=https://your-backend-url.vercel.app
```

### Step 2: Note Your Frontend URL

After deployment, you'll get a URL like:
```
https://hackathon-1-frontend.vercel.app
```

---

## Part 3: Update CORS Configuration

Now that you have your frontend URL, update the backend CORS configuration:

1. Go to your backend project on Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. The CORS is already configured in `backend/app/main.py` to accept Vercel URLs
4. If your frontend URL is different from `hackathon-1-new.vercel.app`, update line 25 in `backend/app/main.py`:
   ```python
   "https://your-actual-frontend-url.vercel.app",
   ```
5. Commit and push changes to trigger a redeployment

---

## Part 4: Configure Custom Domain (Optional)

### For Frontend:
1. Go to your frontend project on Vercel
2. Navigate to **Settings** → **Domains**
3. Add your custom domain (e.g., `robotics.yourdomain.com`)
4. Follow DNS configuration instructions

### For Backend:
1. Go to your backend project on Vercel
2. Navigate to **Settings** → **Domains**
3. Add your custom domain (e.g., `api.yourdomain.com`)
4. Update frontend environment variable `DOCUSAURUS_BACKEND_API_URL` to use new domain

---

## Troubleshooting

### Issue: CORS Errors

**Solution**: Make sure the frontend URL is added to the CORS origins in `backend/app/main.py`

### Issue: Environment Variables Not Working

**Solution**:
1. Check Vercel dashboard → Project → Settings → Environment Variables
2. Ensure variables are set for "Production" environment
3. Redeploy the project

### Issue: Backend 500 Error

**Solution**:
1. Check Vercel dashboard → Project → Deployments → Latest → Functions Log
2. Common issues:
   - Missing environment variables
   - Database connection issues
   - API quota exceeded (OpenAI, Qdrant)

### Issue: Build Fails

**Frontend**: Check `build` logs in Vercel dashboard
**Backend**: Ensure `requirements.txt` has all dependencies

---

## Monitoring and Logs

- **View Logs**: Vercel Dashboard → Your Project → Deployments → Click deployment → View Function Logs
- **Real-time Logs**: Use Vercel CLI: `vercel logs <deployment-url> --follow`

---

## Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `NEON_DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `QDRANT_URL` | Qdrant vector DB URL | `https://xxx.qdrant.io` |
| `QDRANT_API_KEY` | Qdrant API key | `xxx` |
| `SECRET_KEY` | JWT secret for auth | `your-secret-key` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry time | `30` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DOCUSAURUS_BACKEND_API_URL` | Backend API base URL | `https://backend.vercel.app` |

---

## Continuous Deployment

Both projects are configured for **automatic deployments**:
- **Push to `main` branch** → Automatic production deployment
- **Push to other branches** → Automatic preview deployment

---

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS configuration
4. ✅ Test the deployed application
5. 🎉 Share your live application!

---

## Support

For issues related to:
- **Vercel Deployment**: [Vercel Documentation](https://vercel.com/docs)
- **Docusaurus**: [Docusaurus Documentation](https://docusaurus.io/docs)
- **FastAPI**: [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Last Updated**: December 2024
