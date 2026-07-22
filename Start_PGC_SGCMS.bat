@echo off
title PGC SGCMS Launcher & Server Manager
color 0A
echo ======================================================================
echo             PGC SGCMS SYSTEM LAUNCHER & SERVER MANAGER
echo ======================================================================
echo.

:: 1. Launch MongoDB Database in MINIMIZED window
echo [1/4] Starting MongoDB Database on Port 27017 (Minimized)...
start /min "PGC-MongoDB" cmd /c "title PGC-MongoDB && mongod --dbpath C:\data\db"

:: Wait 2 seconds for MongoDB to initialize
timeout /t 2 /nobreak >nul

:: 2. Launch Backend Server in MINIMIZED window
echo [2/4] Starting Express Backend Server on Port 5000 (Minimized)...
start /min "PGC-Backend" cmd /c "title PGC-Backend && cd /d "%~dp0server" && npm run dev"

:: Wait 2 seconds for Backend to initialize
timeout /t 2 /nobreak >nul

:: 3. Launch Frontend App in MINIMIZED window (Production Bundle Preview for Maximum Speed)
echo [3/4] Starting Frontend Web App on Port 5173 (Minimized)...
start /min "PGC-Frontend" cmd /c "title PGC-Frontend && cd /d "%~dp0PGC-SGCMS" && npm run build && npx vite preview --host --port 5173"

:: Wait 2 seconds for Frontend to initialize
timeout /t 2 /nobreak >nul

:: 4. Launch Cloudflare Global Tunnel & Auto-Sync Permanent Redirect Pointer
echo [4/4] Starting Cloudflare Global Tunnel & Auto-Sync Pointer (Minimized)...
start /min "PGC-Cloudflare" cmd /c "title PGC-Cloudflare && node server/scripts/syncTunnel.js"

:: Wait 3 seconds for services to connect
timeout /t 3 /nobreak >nul

echo.
echo ======================================================================
echo   SUCCESS: All 4 PGC SGCMS services are active in background!
echo   Opening Chrome Browser automatically...
echo ======================================================================
echo.

:: Automatically open default browser with the permanent static Vercel URL
start "" "https://pgcswl-sgcms.vercel.app"

:EXIT_PROMPT
echo ----------------------------------------------------------------------
echo   SWIFT EXIT CONTROLLER:
echo   To close ALL servers & taskbar windows cleanly when finished,
echo   simply press ENTER.
echo ----------------------------------------------------------------------
set /p userinput="Press ENTER to close all servers and exit: "

echo.
echo ======================================================================
echo   SWIFT EXIT INITIATED: Shutting down all taskbar server windows...
echo ======================================================================

:: Forcefully terminate all window titles and underlying processes
echo Closing MongoDB, Backend, Frontend, and Ngrok taskbar windows...
taskkill /F /FI "WINDOWTITLE eq PGC-Backend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Frontend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Ngrok*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Cloudflare*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-MongoDB*" /T >nul 2>&1

:: Kill process executables cleanly
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1
taskkill /F /IM mongod.exe >nul 2>&1

timeout /t 1 /nobreak >nul
echo.
echo [OK] All PGC SGCMS taskbar windows and background servers closed.
echo Goodbye!
timeout /t 2 /nobreak >nul
exit /b
