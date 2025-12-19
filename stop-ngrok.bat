@echo off
echo FORCE STOPPING ALL PROCESSES...
echo =================================
echo.

echo [1/4] Killing ngrok processes...
taskkill /f /im ngrok.exe /t > nul 2>&1
for /f "tokens=2" %%i in ('tasklist ^| findstr ngrok 2^>nul') do (
    echo Force killing ngrok PID: %%i
    taskkill /f /pid %%i /t > nul 2>&1
)

echo [2/4] Killing Java processes...
taskkill /f /im java.exe /t > nul 2>&1
for /f "tokens=2" %%i in ('tasklist ^| findstr java 2^>nul') do (
    echo Force killing Java PID: %%i
    taskkill /f /pid %%i /t > nul 2>&1
)

echo [3/4] Killing Node.js processes...
taskkill /f /im node.exe /t > nul 2>&1
for /f "tokens=2" %%i in ('tasklist ^| findstr node 2^>nul') do (
    echo Force killing Node PID: %%i
    taskkill /f /pid %%i /t > nul 2>&1
)

echo [4/4] Final cleanup...
timeout /t 3 /nobreak > nul

echo.
echo VERIFICATION:
echo =============
tasklist | findstr "ngrok java node" > nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ WARNING: Some processes are still running!
    echo.
    echo MANUAL STEPS:
    echo 1. Press Ctrl+Shift+Esc (Task Manager)
    echo 2. Find and End Task for:
    echo    - ngrok.exe
    echo    - java.exe (if any)
    echo    - node.exe (if any)
    echo 3. Try running this script again
    echo 4. If still fails, restart your computer
    echo.
) else (
    echo ✅ SUCCESS: All processes stopped cleanly!
)

echo.
echo READY TO RESTART APPLICATION
echo ===========================
echo You can now safely run your ngrok scripts.
echo.
pause
