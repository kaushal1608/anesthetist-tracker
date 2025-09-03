# 🚀 Deployment Guide: Vercel + Render

Deploy your Anesthetist Service Tracker to the cloud for free!

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **Render Account** - Sign up at https://render.com

## 🔧 Step 1: Prepare Your Code

### Push to GitHub:

**⚠️ Important: Don't commit node_modules!**

```bash
# Initialize git (if not already done)
git init

# Check .gitignore exists (should exclude node_modules)
cat .gitignore

# Add files (node_modules will be excluded)
git add .

# Check what's being added (should NOT include node_modules)
git status

# Commit
git commit -m "Initial commit: Anesthetist Service Tracker"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/yourusername/anesthetist-tracker.git
git push -u origin main
```

**If you accidentally added node_modules:**
```bash
# Run the fix script
fix-git-nodemodules.bat

# Or manually:
git rm -r --cached frontend/node_modules
git commit -m "Remove node_modules from tracking"
```

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create Render Web Service:
1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `anesthetist-tracker-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Plan**: Free

### 2.2 Environment Variables (Optional):
- `PYTHON_VERSION`: `3.10.0`

### 2.3 Deploy:
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- Copy your backend URL: `https://your-app-name.onrender.com`

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project:
1. Go to https://vercel.com/dashboard
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.2 Environment Variables:
Add in Vercel dashboard → Settings → Environment Variables:
```
REACT_APP_API_URL = https://your-backend-url.onrender.com/api
```

### 3.3 Deploy:
- Click **"Deploy"**
- Wait 2-3 minutes for deployment
- Get your frontend URL: `https://your-app.vercel.app`

## 🔄 Step 4: Update CORS Settings

Update your backend CORS in `backend/app.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://your-actual-frontend-url.vercel.app",  # Replace with your URL
    "https://*.vscode.dev"
],
```

Commit and push changes - Render will auto-redeploy.

## ✅ Step 5: Test Your Deployment

1. **Open your Vercel URL**: `https://your-app.vercel.app`
2. **Login with**:
   - Email: `doctor@example.com`
   - Password: `password123`
3. **First request may take 30 seconds** (Render free tier cold start)

## 📱 Step 6: Share Your App

**Your live app URLs:**
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`

**Share the frontend URL with testers!**

## 🔧 Troubleshooting

### Backend Issues:
- Check Render logs in dashboard
- Ensure all dependencies in `requirements.txt`
- Verify Python version compatibility

### Frontend Issues:
- Check Vercel function logs
- Verify `REACT_APP_API_URL` environment variable
- Check browser console for CORS errors

### CORS Errors:
- Update `allow_origins` in backend with exact Vercel URL
- Redeploy backend after CORS changes

## 💰 Costs

- **Vercel**: Free (100GB bandwidth/month)
- **Render**: Free (750 hours/month, sleeps after 15min idle)
- **Total**: ₹0 per month

## 🔄 Auto-Deployment

Both platforms auto-deploy on git push:
- **Vercel**: Deploys on every push to main branch
- **Render**: Deploys on every push to main branch

## 📊 Performance Notes

- **Frontend**: Always fast (Vercel CDN)
- **Backend**: 30-second cold start on first request after 15min idle
- **Database**: SQLite file persists on Render free tier

Your app is now live and ready for testing! 🎉