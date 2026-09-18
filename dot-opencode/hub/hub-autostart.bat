@echo off
:: OpenCode Hub - Windows Auto-Start
:: This script starts the Hub Server and Dashboard silently on login

:: Set working directory
cd /d "C:\KEYROZ DIGITAL SOLUTIONS\opencode\packages\server"

:: Start Hub Server (hidden)
start /min "" node --import tsx/esm src/index.ts

:: Wait for server to be ready
timeout /t 5 /nobreak >nul

:: Start Dashboard (hidden)
cd /d "C:\KEYROZ DIGITAL SOLUTIONS\opencode\packages\dashboard"
start /min "" npx vite --port 5173
