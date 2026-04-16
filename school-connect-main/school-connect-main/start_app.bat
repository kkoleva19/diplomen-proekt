@echo off
setlocal
echo ==========================================
echo    School Connect - Startup Script
echo ==========================================
echo.

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Error: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo.
echo [1/2] Installing/Checking dependencies...
:: Using npm.cmd explicitly to bypass PowerShell execution policy issues
call npm.cmd install --no-audit
if %errorlevel% neq 0 (
    echo [!] Error occurred during dependency installation.
    pause
    exit /b
)

echo.
echo [2/2] Starting development server...
echo.
echo The application will open automatically in your browser.
echo If it doesn't, please go to: http://localhost:8080
echo.
:: Using npm.cmd explicitly and starting the dev server
call npm.cmd run dev
if %errorlevel% neq 0 (
    echo.
    echo [!] Development server stopped unexpectedly.
    pause
)

endlocal
