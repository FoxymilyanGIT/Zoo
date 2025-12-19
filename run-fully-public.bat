@echo off
echo Starting FULLY PUBLIC ZooPark Application!
echo Both backend and frontend will be accessible from internet.
echo.

echo Make sure ngrok is installed!
echo Download from: https://ngrok.com/download
echo.

echo Ensuring clean ngrok state...
for /f "tokens=2" %%i in ('tasklist ^| findstr ngrok 2^>nul') do (
    taskkill /f /pid %%i > nul 2>&1
)
timeout /t 3 /nobreak > nul

echo Starting backend server...
start "Backend" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak > nul

echo Starting ngrok tunnel for backend API (port 8080)...
start "ngrok-backend" cmd /k "ngrok http 8080"

echo Waiting 5 seconds for backend ngrok...
timeout /t 5 /nobreak > nul

echo Starting frontend development server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo Waiting 5 seconds for frontend...
timeout /t 5 /nobreak > nul

echo Starting ngrok tunnel for frontend (port 5173)...
start "ngrok-frontend" cmd /k "ngrok http 5173"

echo.
echo ================================================
echo 🚀 FULLY PUBLIC ZOOPARK APPLICATION!
echo ================================================
echo.
echo ✅ Backend API: Check ngrok-backend terminal for public URL
echo ✅ Frontend Site: Check ngrok-frontend terminal for public URL
echo 📊 ngrok Dashboard: http://127.0.0.1:4040
echo.
echo 🔧 IMPORTANT SETUP STEPS:
echo.
echo 1. Copy BACKEND ngrok URL from ngrok-backend terminal
echo    (Example: https://abc123.ngrok.io)
echo.
echo 2. Copy FRONTEND ngrok URL from ngrok-frontend terminal
echo    (Example: https://def456.ngrok.io)
echo.
echo 3. Configure frontend to connect to backend:
echo    In a NEW terminal, run:
echo    cd frontend && echo VITE_API_BASE_URL=https://YOUR_BACKEND_URL.ngrok.io > .env.local
echo.
echo 4. Restart frontend:
echo    Ctrl+C in frontend terminal, then: npm run dev
echo.
echo 5. SHARE the FRONTEND URL with anyone!
echo    They can access your complete application from anywhere!
echo.
echo 🎉 Your application is now PUBLIC and SHAREABLE!
echo.
echo 🌐 Access points:
echo    - Public Frontend: [ngrok-frontend URL]
echo    - Public API: [ngrok-backend URL]/api/health
echo    - ngrok Dashboard: http://127.0.0.1:4040
echo.
echo Press any key to stop all services...
pause > nul

echo Stopping all services...
taskkill /f /im java.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im ngrok.exe > nul 2>&1

echo All services stopped.
pause
