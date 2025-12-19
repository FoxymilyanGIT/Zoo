@echo off
echo Stopping all ngrok processes...
taskkill /f /im ngrok.exe > nul 2>&1

echo Stopping Java processes (backend)...
taskkill /f /im java.exe > nul 2>&1

echo Stopping Node.js processes (frontend)...
taskkill /f /im node.exe > nul 2>&1

echo All processes stopped.
echo You can now restart the application safely.
pause
