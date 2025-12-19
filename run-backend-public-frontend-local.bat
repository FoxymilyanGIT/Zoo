@echo off
echo Starting Backend Public + Frontend Local setup...
echo This is what you asked for: Backend accessible from internet, Frontend local.
echo.

echo Make sure ngrok is installed!
echo Download from: https://ngrok.com/download
echo.

echo Starting backend server...
start "Backend" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak > nul

echo Starting ngrok tunnel for backend API...
start "ngrok-backend" cmd /k "ngrok http 8080"

echo Waiting 5 seconds for ngrok...
timeout /t 5 /nobreak > nul

echo Starting frontend development server locally...
start "Frontend-Local" cmd /k "cd frontend && npm run dev"

echo Waiting 5 seconds for frontend...
timeout /t 5 /nobreak > nul

set /p make_public="Make frontend public too? (y/n): "
if /i "%make_public%"=="y" goto make_frontend_public
if /i "%make_public%"=="yes" goto make_frontend_public

echo.
echo ================================================
echo 🔧 BACKEND PUBLIC + FRONTEND LOCAL
echo ================================================
echo.
echo ✅ Backend API is PUBLIC via ngrok-backend terminal
echo ✅ Frontend runs LOCALLY at http://localhost:5173
echo ✅ Frontend can connect to public backend API
echo.
goto instructions

:make_frontend_public
echo Starting ngrok tunnel for frontend...
start "ngrok-frontend" cmd /k "ngrok http 5173"

echo.
echo ================================================
echo 🚀 FULLY PUBLIC APPLICATION!
echo ================================================
echo.
echo ✅ Backend API is PUBLIC via ngrok-backend terminal
echo ✅ Frontend is PUBLIC via ngrok-frontend terminal
echo ✅ Anyone can access your complete application!
echo.

:instructions
echo 📋 NEXT STEPS:
echo.
echo 1. Copy the ngrok URL for backend from ngrok-backend terminal
echo    (Example: https://abc123.ngrok.io)
echo.
if /i "%make_public%"=="y" (
    echo 2. Frontend is now public! Check ngrok-frontend terminal for URL
    echo 3. Share both URLs with anyone!
) else (
    echo 2. Configure frontend to use backend API:
    echo    cd frontend
    echo    echo VITE_API_BASE_URL=https://YOUR_NGROK_URL.ngrok.io > .env.local
    echo.
    echo 3. Restart frontend if needed:
    echo    Ctrl+C in frontend terminal, then: npm run dev
    echo.
    echo 4. Visit your local frontend: http://localhost:5173
    echo    (It will connect to the public backend API!)
)
echo.
echo 🎉 Your setup: %make_public%ublic website connecting to public API!
echo.
echo 📊 ngrok Dashboard: http://127.0.0.1:4040
echo 🔍 Backend Health Check: [your-ngrok-url]/api/health
echo.
echo Press any key to stop all services...
pause > nul

echo Stopping services...
taskkill /f /im java.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im ngrok.exe > nul 2>&1

echo Services stopped.
pause
