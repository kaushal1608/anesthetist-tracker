# ⚡ Quick Deploy Checklist

## 🚀 5-Minute Deployment

### 1. Push to GitHub
```bash
# Check .gitignore exists (excludes node_modules)
git init
git add .          # This will exclude node_modules
git commit -m "Anesthetist Tracker App"
git remote add origin https://github.com/YOUR_USERNAME/anesthetist-tracker.git
git push -u origin main
```

**⚠️ If git add is slow:** You might be including node_modules
- Run `fix-git-nodemodules.bat` to fix it

### 2. Deploy Backend (Render)
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
4. Deploy & copy URL

### 3. Deploy Frontend (Vercel)
1. Go to https://vercel.com → New Project
2. Import GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy & copy URL

### 4. Update CORS
In `backend/app.py`, replace:
```python
"https://patient-tracker.vercel.app"  # With your actual Vercel URL
```

### 5. Test
- Open your Vercel URL
- Login: `doctor@example.com` / `password123`
- First load takes 30 seconds (backend wakeup)

## 📱 Share Links
- **App**: `https://your-app.vercel.app`
- **Login**: doctor@example.com / password123

Done! 🎉