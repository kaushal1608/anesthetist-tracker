@echo off
echo Setting up Ngrok for public access...
echo.
echo 1. Download ngrok from: https://ngrok.com/download
echo 2. Extract ngrok.exe to this folder
echo 3. Sign up at ngrok.com and get your auth token
echo 4. Run: ngrok authtoken YOUR_TOKEN
echo 5. Run this script again
echo.

if not exist ngrok.exe (
    echo ngrok.exe not found! Please download and place it here.
    pause
    exit
)

echo Starting servers...
start cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak > nul

start cmd /k "cd frontend && npm start"
timeout /t 5 /nobreak > nul

echo Creating public tunnels...
start cmd /k "ngrok http 8000 --log stdout"
start cmd /k "ngrok http 3000 --log stdout"

echo.
echo Check the ngrok windows for your public URLs!
echo Share the frontend URL (port 3000) with testers.
pause