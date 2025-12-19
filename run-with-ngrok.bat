@echo off
echo Starting ZooPark application with ngrok...
echo.

echo Make sure ngrok is installed and authenticated!
echo Download from: https://ngrok.com/download
echo.

echo Starting backend server...
start "Backend" cmd /k "cd backend && java -jar target/zoopark-backend-0.0.1-SNAPSHOT.jar"

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak > nul

echo Starting ngrok tunnel...
start "ngrok" cmd /k "ngrok http 8080"

echo.
echo Application should be available at the ngrok URL shown above.
echo Check ngrok dashboard at http://localhost:4040 for the public URL.
echo.
echo Press any key to stop all services...
pause > nul

echo Stopping services...
taskkill /f /im java.exe > nul 2>&1
taskkill /f /im ngrok.exe > nul 2>&1

echo Services stopped.
pause
