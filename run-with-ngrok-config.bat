@echo off
echo ZooPark with ngrok.yml Configuration
echo ===================================
echo.

echo IMPORTANT: You need to configure ngrok.yml first!
echo ================================================
echo.
echo 1. Copy ngrok.yml from project root to: C:\Users\%USERNAME%\.ngrok2\ngrok.yml
echo 2. Edit the file and replace YOUR_NGROK_AUTH_TOKEN_HERE with your actual token
echo 3. Save the file
echo.
echo Your ngrok auth token can be found at: https://dashboard.ngrok.com/auth
echo.

pause
echo.

echo Starting backend server...
start "Backend" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak > nul

echo Starting frontend development server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo Waiting 5 seconds for frontend...
timeout /t 5 /nobreak > nul

echo.
echo ================================================
echo START NGROK TUNNELS MANUALLY
echo ================================================
echo.
echo In a NEW terminal, run:
echo ngrok start backend frontend
echo.
echo This will create:
echo - backend tunnel: https://random.ngrok.io -> localhost:8080
echo - frontend tunnel: https://random.ngrok.io -> localhost:5173
echo.
echo Copy the URLs and configure frontend:
echo echo VITE_API_BASE_URL=[BACKEND_URL] > frontend/.env.local
echo.
echo Then restart frontend: Ctrl+C then npm run dev
echo.
echo Press any key to show status...
pause > nul

echo Checking ngrok status...
start "ngrok-status" cmd /k "ngrok api tunnels list"

echo.
echo 🌐 Check ngrok dashboard: http://127.0.0.1:4040
echo 📊 Check tunnel status above
echo.
echo Press any key to stop all services...
pause > nul

echo Stopping services...
taskkill /f /im java.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im ngrok.exe > nul 2>&1

echo Services stopped.
pause
