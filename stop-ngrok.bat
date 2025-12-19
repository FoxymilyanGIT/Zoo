@echo off
echo Stopping all running processes...
echo.

echo Finding and stopping ngrok processes...
for /f "tokens=2" %%i in ('tasklist ^| findstr ngrok') do (
    echo Stopping ngrok PID: %%i
    taskkill /f /pid %%i > nul 2>&1
)

echo Finding and stopping Java processes (Spring Boot)...
for /f "tokens=2" %%i in ('tasklist ^| findstr java') do (
    echo Stopping Java PID: %%i
    taskkill /f /pid %%i > nul 2>&1
)

echo Finding and stopping Node.js processes (Vite)...
for /f "tokens=2" %%i in ('tasklist ^| findstr node') do (
    echo Stopping Node PID: %%i
    taskkill /f /pid %%i > nul 2>&1
)

echo.
echo Checking for any remaining processes...
tasklist | findstr "ngrok java node" > nul 2>&1
if %errorlevel% equ 0 (
    echo WARNING: Some processes may still be running.
    echo Try running this script again or restart your computer.
) else (
    echo SUCCESS: All processes stopped cleanly.
)

echo.
echo You can now safely restart the application.
echo Press any key to continue...
pause > nul
