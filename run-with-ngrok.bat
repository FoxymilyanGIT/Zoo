@echo off
echo Starting ZooPark Full Stack Application with ngrok...
echo.

echo Make sure ngrok is installed and authenticated!
echo Download from: https://ngrok.com/download
echo.

echo Stopping any existing ngrok processes...
taskkill /f /im ngrok.exe > nul 2>&1
timeout /t 2 /nobreak > nul

echo Starting backend server...
start "Backend" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak > nul

echo Starting ngrok tunnel for backend (port 8080)...
start "ngrok-backend" cmd /k "ngrok http 8080"

echo Waiting 5 seconds for ngrok to initialize...
timeout /t 5 /nobreak > nul

echo Starting frontend development server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ================================================
echo 🚀 ZOOPARK APPLICATION STARTED!
echo ================================================
echo.
echo 📡 BACKEND API: Available at ngrok URL (check ngrok terminal)
echo 🌐 FRONTEND SITE: http://localhost:5173
echo 📊 NGROK DASHBOARD: http://127.0.0.1:4040
echo.
echo 🔧 IMPORTANT: Configure frontend to use backend API
echo.
echo Step 1: Copy ngrok URL from ngrok terminal (e.g., https://abc123.ngrok.io)
echo Step 2: Run this command in NEW terminal:
echo cd frontend && echo VITE_API_BASE_URL=https://YOUR_NGROK_URL.ngrok.io > .env.local
echo.
echo Step 3: Restart frontend: Ctrl+C in frontend terminal, then npm run dev
echo.
echo 🎉 Then visit http://localhost:5173 to see your full application!
echo.
echo Press any key to stop all services...
pause > nul

echo Stopping services...
taskkill /f /im java.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im ngrok.exe > nul 2>&1

echo Services stopped.
pause
