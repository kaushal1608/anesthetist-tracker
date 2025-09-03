# Deploy to Railway (Free Tier)

## Steps:

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend:**
   - Create new project
   - Connect your GitHub repo
   - Railway will auto-detect FastAPI
   - Add environment variables if needed

3. **Deploy Frontend:**
   - Create another service in same project
   - Set build command: `cd frontend && npm run build`
   - Set start command: `cd frontend && npm start`

4. **Get URLs:**
   - Railway provides URLs like: `https://your-app.railway.app`

## Files needed for Railway: