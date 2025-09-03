# Deploy to Render (Free Tier)

## Steps:

1. **Create Render Account:**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend:**
   - New Web Service
   - Connect GitHub repo
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python app.py`

3. **Deploy Frontend:**
   - New Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

4. **Update API URLs:**
   - Get backend URL from Render
   - Update frontend API_BASE_URL