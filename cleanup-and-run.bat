@echo off
echo NGROK CLEANUP & RESTART
echo =======================
echo.

echo Step 1: Force stopping all processes...
call stop-ngrok.bat

echo.
echo Step 2: Starting fresh application...
echo ====================================
run-fully-public.bat

echo.
echo Script completed.
pause
