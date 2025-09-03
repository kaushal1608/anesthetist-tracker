@echo off
echo Getting your IP address for network sharing...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do set IP=%%i
set IP=%IP: =%

echo.
echo Starting Anesthetist Service Tracker for Network Access...
echo.
echo Backend starting on: http://%IP%:8000
echo Frontend will be available at: http://%IP%:3000
echo.
echo Share this link with testers: http://%IP%:3000
echo Default login: doctor@example.com / password123
echo.

echo Starting Backend Server...
start cmd /k "cd backend && pip install -r requirements.txt && python app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
start cmd /k "cd frontend && set HOST=%IP% && npm install && npm start"

echo.
echo Servers are starting...
echo Press any key to exit...
pause > nul