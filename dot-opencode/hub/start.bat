@echo off
title OpenCode Hub — Launcher
echo ========================================
echo  OpenCode Hub — Launcher
echo ========================================
echo.

:: Hub Server (background)
echo [1] Starting Hub Server (port 3000)...
start "Hub-Server" cmd /c "cd /d %~dp0..\..\KEYROZ DIGITAL SOLUTIONS\opencode\packages\server && npx tsx src/index.ts"
timeout /t 4 /nobreak >nul

:: Dashboard (background)
echo [2] Starting Dashboard (port 5173)...
start "Hub-Dashboard" cmd /c "cd /d %~dp0..\..\KEYROZ DIGITAL SOLUTIONS\opencode\packages\dashboard && npx vite --port 5173"
timeout /t 4 /nobreak >nul

:: Verify
powershell -Command "try { $a = (Invoke-WebRequest 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 2).StatusCode; Write-Host '  Server:' $a -f Green } catch { Write-Host '  Server: OFFLINE' -f Red }"
powershell -Command "try { $b = (Invoke-WebRequest 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2).StatusCode; Write-Host '  Dashboard:' $b -f Green } catch { Write-Host '  Dashboard: OFFLINE' -f Red }"

echo.
echo ========================================
echo  Stack running:
echo    Server:   http://localhost:3000
echo    API:      http://localhost:3000/api/*
echo    Dashboard: http://localhost:5173
echo.
echo  Plugin: %USERPROFILE%\.config\opencode\plugins\hub-telemetry.ts
echo.
echo  NEXT: To capture REAL OpenCode data, open a NEW terminal:
echo.
echo    set HUB_API_URL=http://localhost:3000
echo    opencode
echo.
echo  Then use OpenCode normally and check the dashboard.
echo ========================================
pause
