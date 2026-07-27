@echo off
title PGC SGCMS Launcher and Server Manager
color 0A
echo ======================================================================
echo             PGC SGCMS SYSTEM LAUNCHER AND SERVER MANAGER
echo ======================================================================
echo.

:: -----------------------------------------------------------------------
:: PRE-STARTUP CLEANUP: Kill any stale processes from previous sessions
:: This prevents stale tunnel URLs and port conflicts on re-launch
:: -----------------------------------------------------------------------
echo [CLEANUP] Clearing stale processes from previous sessions...
taskkill /F /IM cloudflared.exe >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-MongoDB*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Backend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Frontend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Cloudflare*" /T >nul 2>&1
taskkill /F /IM mongod.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo [CLEANUP] Done. Starting fresh...
echo.

:: -----------------------------------------------------------------------
:: 1. Launch MongoDB Database
:: -----------------------------------------------------------------------
echo [1/4] Starting MongoDB Database on Port 27017 (Minimized)...
start /min "PGC-MongoDB" cmd /c "title PGC-MongoDB && mongod --dbpath C:\data\db"

:: Wait for MongoDB to initialize
timeout /t 3 /nobreak >nul

:: -----------------------------------------------------------------------
:: 2. Launch Backend Server
:: -----------------------------------------------------------------------
echo [2/4] Starting Express Backend Server on Port 5000 (Minimized)...
start /min "PGC-Backend" cmd /c "title PGC-Backend && cd /d "%~dp0server" && npm run dev"

:: Wait for Backend to initialize
timeout /t 3 /nobreak >nul

:: -----------------------------------------------------------------------
:: 3. Launch Frontend Web App (Build + Preview)
:: Note: npm run build may take 15-30 seconds before vite preview is ready
:: -----------------------------------------------------------------------
echo [3/4] Starting Frontend Web App on Port 5173 (Minimized)...
echo       [NOTE] Frontend build may take up to 30 seconds...
start /min "PGC-Frontend" cmd /c "title PGC-Frontend && cd /d "%~dp0PGC-SGCMS" && npm run build && npx vite preview --host --port 5173"

:: Wait longer for frontend build to complete before tunnel starts
timeout /t 20 /nobreak >nul

:: -----------------------------------------------------------------------
:: 4. Launch Cloudflare Tunnel + Auto-Sync Redirect Pointer
:: -----------------------------------------------------------------------
echo [4/4] Starting Cloudflare Global Tunnel and Auto-Sync Pointer (Minimized)...
start /min "PGC-Cloudflare" cmd /c "title PGC-Cloudflare && cd /d "%~dp0" && node server/scripts/syncTunnel.js"

:: Wait for tunnel to connect and write live_tunnel.json
echo       [WAIT] Connecting to Cloudflare network (up to 15 seconds)...
timeout /t 15 /nobreak >nul

echo.
echo ======================================================================
echo   SUCCESS: All 4 PGC SGCMS services are active in background!
echo ======================================================================
echo.

:: Read and display the live tunnel URL from live_tunnel.json
echo   LIVE TUNNEL URL (from live_tunnel.json):
for /f "tokens=2 delims=:/ " %%A in ('findstr /i "url" "%~dp0live_tunnel.json" 2^>nul') do (
    echo   >> https://%%A.trycloudflare.com
)
echo.
echo   Permanent Redirect: https://pgcswl-sgcms.vercel.app
echo   Browser opened automatically when tunnel was ready.
echo.

:EXIT_PROMPT
echo ----------------------------------------------------------------------
echo   SWIFT EXIT CONTROLLER:
echo   To close ALL servers and taskbar windows cleanly when finished,
echo   simply press ENTER.
echo ----------------------------------------------------------------------
set /p userinput="Press ENTER to close all servers and exit: "

echo.
echo ======================================================================
echo   SWIFT EXIT INITIATED: Shutting down all services...
echo ======================================================================

:: Forcefully terminate all named windows
echo Closing all PGC SGCMS taskbar windows...
taskkill /F /FI "WINDOWTITLE eq PGC-Backend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Frontend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Cloudflare*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-MongoDB*" /T >nul 2>&1

:: Kill process executables cleanly
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1
taskkill /F /IM mongod.exe >nul 2>&1

timeout /t 1 /nobreak >nul
echo.
echo [OK] All PGC SGCMS services stopped cleanly.
echo Goodbye!
timeout /t 2 /nobreak >nul
exit /b
