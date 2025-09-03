@echo off
echo 🚀 Anesthetist Tracker - Cloud Deployment Helper
echo.

echo Step 1: Preparing git repository...
if not exist .git (
    echo Initializing git repository...
    git init
    echo ✅ Git repository initialized
)

echo Checking .gitignore...
if not exist .gitignore (
    echo ⚠️  .gitignore not found - this will include node_modules!
) else (
    echo ✅ .gitignore found - node_modules will be excluded
)

echo.
echo 📁 Files to be committed (excluding node_modules):
git status --porcelain | findstr /V "node_modules"

echo.
echo Ready to commit? This will exclude node_modules and other large files.
pause

echo Adding files to git (excluding node_modules)...
git add .
git status

echo.
echo Committing changes...
git commit -m "Initial commit: Anesthetist Service Tracker"
echo ✅ Repository ready for deployment

echo.
echo Step 2: Deployment Instructions
echo.
echo 📋 BACKEND DEPLOYMENT (Render):
echo 1. Go to https://render.com/dashboard
echo 2. Click "New +" → "Web Service"
echo 3. Connect this GitHub repository
echo 4. Configure:
echo    - Name: anesthetist-tracker-backend
echo    - Root Directory: backend
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: python app.py
echo    - Plan: Free
echo 5. Deploy and copy the URL
echo.

echo 🌐 FRONTEND DEPLOYMENT (Vercel):
echo 1. Go to https://vercel.com/dashboard
echo 2. Click "New Project"
echo 3. Import this GitHub repository
echo 4. Configure:
echo    - Root Directory: frontend
echo 5. Add Environment Variable:
echo    - REACT_APP_API_URL = https://your-backend-url.onrender.com/api
echo 6. Deploy and copy the URL
echo.

echo 🔧 FINAL STEPS:
echo 1. Update CORS in backend/app.py with your Vercel URL
echo 2. Push changes to GitHub
echo 3. Both services will auto-redeploy
echo.

echo 📱 TEST YOUR APP:
echo - Login: doctor@example.com
echo - Password: password123
echo - First request may take 30 seconds (backend cold start)
echo.

echo 📖 For detailed instructions, see DEPLOYMENT.md
echo ⚡ For quick checklist, see QUICK-DEPLOY.md
echo.

echo Press any key to open deployment guides...
pause > nul

start DEPLOYMENT.md
start QUICK-DEPLOY.md