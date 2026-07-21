@echo off
title PGC SGCMS Launcher & Server Manager
color 0A
echo ======================================================================
echo             PGC SGCMS SYSTEM LAUNCHER & SERVER MANAGER
echo ======================================================================
echo.

:: 1. Launch MongoDB Database in a new window
echo [1/3] Starting MongoDB Database on Port 27017...
start "PGC-MongoDB" cmd /k "title PGC-MongoDB && mongod --dbpath C:\data\db"

:: Wait 2 seconds for MongoDB to initialize
timeout /t 2 /nobreak >nul

:: 2. Launch Backend Server in a new window
echo [2/3] Starting Express Backend Server on Port 5000...
start "PGC-Backend" cmd /k "title PGC-Backend && cd /d "%~dp0server" && npm run dev"

:: Wait 2 seconds for Backend to initialize
timeout /t 2 /nobreak >nul

:: 3. Launch Frontend App in a new window (Host mode for LAN/Mobile access)
echo [3/3] Starting Frontend Web App on Port 5173 (Host Mode)...
start "PGC-Frontend" cmd /k "title PGC-Frontend && cd /d "%~dp0PGC-SGCMS" && npx vite --host"

echo.
echo ======================================================================
echo   SUCCESS: All 3 PGC SGCMS services are running!
echo   - MongoDB DB: http://127.0.0.1:27017
echo   - Backend:    http://localhost:5000 (LAN: http://192.168.137.121:5000)
echo   - Frontend:   http://localhost:5173 (LAN: http://192.168.137.121:5173)
echo ======================================================================
echo.

:EXIT_PROMPT
echo ----------------------------------------------------------------------
echo   SWIFT EXIT CONTROLLER:
echo   To precisely shutdown all 3 servers and exit, press Y and ENTER.
echo ----------------------------------------------------------------------
set /p userinput="Type 'Y' or press ENTER to close all servers and exit [Y/N]: "

if /i "%userinput%"=="N" (
    echo.
    echo Servers remain active in background.
    pause
    exit /b
)

echo.
echo ======================================================================
echo   SWIFT EXIT INITIATED: Terminating MongoDB, Backend & Frontend...
echo ======================================================================

:: Gracefully terminate NodeJS (Backend/Frontend) and MongoDB processes
echo Closing node.exe processes (Backend & Vite Frontend)...
taskkill /F /FI "WINDOWTITLE eq PGC-Backend*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PGC-Frontend*" /T >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

echo Closing mongod.exe process (MongoDB Database)...
taskkill /F /FI "WINDOWTITLE eq PGC-MongoDB*" /T >nul 2>&1
taskkill /F /IM mongod.exe >nul 2>&1

timeout /t 1 /nobreak >nul
echo.
echo [OK] All PGC SGCMS servers and MongoDB database precisely closed.
echo Goodbye!
timeout /t 2 /nobreak >nul
exit /b
