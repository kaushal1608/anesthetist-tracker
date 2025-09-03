# Anesthetist Service Tracker

A comprehensive web application for anesthetist doctors to log, track, and manage their hospital services with secure authentication, file uploads, and Excel export capabilities.

## Features

- 🔐 Secure user authentication (JWT-based)
- 📝 Service logging with file attachments
- 📊 Interactive dashboard with filtering
- 📈 Summary statistics and reporting
- 📋 Excel export functionality
- 🏥 Dynamic hospital management
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 18 + TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite (easily configurable to PostgreSQL/MySQL)
- **Authentication**: JWT tokens
- **File Storage**: Local uploads folder
- **Excel Export**: pandas + openpyxl

## 🚀 Deployment Options

### Option 1: Cloud Deployment (Recommended)
Deploy for free on Vercel + Render:
- **Frontend**: Vercel (always fast)
- **Backend**: Render (free tier, 30s cold start)
- **Total Cost**: ₹0/month

📖 **[Complete Deployment Guide](DEPLOYMENT.md)**
⚡ **[Quick Deploy Checklist](QUICK-DEPLOY.md)**

### Option 2: Local Development

#### Prerequisites
- Node.js 16+
- Python 3.8+
- npm or yarn

#### Installation

1. **Clone and setup backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

2. **Setup frontend:**
```bash
cd frontend
npm install
npm start
```

3. **Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Project Structure

```
anesthetist-tracker/
├── backend/
│   ├── app.py              # FastAPI main application
│   ├── models.py           # Database models
│   ├── auth.py             # Authentication utilities
│   ├── database.py         # Database configuration
│   ├── requirements.txt    # Python dependencies
│   └── uploads/            # File storage directory
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Default Login
- Email: doctor@example.com
- Password: password123

The app will create a default user on first run.