@echo off
echo.
echo ================================================
echo 🚀 ZOOPARK NGROK LAUNCHER - Choose your setup!
echo ================================================
echo.
echo Option 1: Frontend Public, Backend Local (limited)
echo          - Frontend accessible from internet
echo          - Backend only works locally
echo          - Frontend cannot connect to backend
echo.
echo Option 2: Both Public via ngrok (RECOMMENDED)
echo          - Full application accessible from internet
echo          - Frontend connects to backend perfectly
echo          - Best for demos and sharing
echo.
echo Option 3: Backend Public, Frontend Local (you asked for this)
echo          - Backend API accessible from internet
echo          - Frontend runs locally on your machine
echo          - Frontend can connect to public backend API
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto option1
if "%choice%"=="2" goto option2
if "%choice%"=="3" goto option3
goto end

:option1
echo.
echo ⚠️  WARNING: This setup has limitations!
echo Frontend will be public but cannot connect to local backend.
echo Use Option 2 or 3 for full functionality.
echo.
pause
goto frontend_public

:option2
echo.
echo ✅ RECOMMENDED: Full public application!
echo Both frontend and backend will be accessible from internet.
echo.
goto both_public

:option3
echo.
echo 🔧 BACKEND PUBLIC + FRONTEND LOCAL
echo Backend will be public, frontend local (as you requested).
echo.
goto backend_public

:frontend_public
echo Starting Frontend Public + Backend Local...
echo.

echo Starting backend locally...
start "Backend-Local" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

echo Starting frontend dev server...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo Starting ngrok for frontend only...
start "ngrok-frontend" cmd /k "ngrok http 5173"

echo.
echo 🌐 Frontend public at ngrok URL (check ngrok terminal)
echo 🔧 Backend local at http://localhost:8080 (only you)
echo ⚠️  Frontend cannot connect to backend in this setup
echo.
goto wait_stop

:backend_public
echo Starting Backend Public + Frontend Local...
echo.

echo Starting backend...
start "Backend" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

timeout /t 10 /nobreak > nul

echo Starting ngrok for backend...
start "ngrok-backend" cmd /k "ngrok http 8080"

timeout /t 5 /nobreak > nul

echo Starting frontend locally...
start "Frontend-Local" cmd /k "cd frontend && npm run dev"

echo.
echo 🔧 Backend public at ngrok URL (check ngrok terminal)
echo 🌐 Frontend local at http://localhost:5173
echo ✅ Frontend can connect to public backend API
echo.
echo INSTRUCTIONS:
echo 1. Copy ngrok URL for backend (e.g., https://abc123.ngrok.io)
echo 2. In frontend terminal, run:
echo    echo VITE_API_BASE_URL=https://abc123.ngrok.io > .env.local
echo 3. Restart frontend: Ctrl+C then npm run dev
echo 4. Visit http://localhost:5173
echo.
goto wait_stop

:both_public
echo Starting Both Services Public...
echo.

echo Starting backend...
start "Backend" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

timeout /t 15 /nobreak > nul

echo Starting ngrok for backend...
start "ngrok-backend" cmd /k "ngrok http 8080"

timeout /t 5 /nobreak > nul

echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo Starting ngrok for frontend...
start "ngrok-frontend" cmd /k "ngrok http 5173"

echo.
echo 🚀 FULL APPLICATION PUBLIC!
echo 🔧 Backend API: Check ngrok-backend terminal
echo 🌐 Frontend Site: Check ngrok-frontend terminal
echo 📊 Dashboard: http://127.0.0.1:4040
echo.
echo IMPORTANT: Configure frontend to use backend API URL
echo 1. Copy backend ngrok URL
echo 2. In frontend terminal: echo VITE_API_BASE_URL=BACKEND_URL > .env.local
echo 3. Restart frontend
echo.
goto wait_stop

:wait_stop
echo.
echo Press any key to stop all services...
pause > nul

echo Stopping all services...
taskkill /f /im java.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im ngrok.exe > nul 2>&1
echo All services stopped.
pause

:end
