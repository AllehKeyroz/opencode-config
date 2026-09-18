#!/usr/bin/env pwsh
<#
.SYNOPSIS
    OpenCode Hub CLI — manage the Hub stack from anywhere
.DESCRIPTION
    Commands:
      hub up       Start Hub Server + Dashboard (hidden)
      hub stop     Stop all Hub processes
      hub status   Check what's running
      hub restart  Restart everything
.EXAMPLE
    hub up
    hub status
#>

param(
    [Parameter(Position = 0)]
    [ValidateSet("up", "stop", "status", "restart")]
    [string]$Command = "status"
)

$ROOT = "$env:USERPROFILE\KEYROZ DIGITAL SOLUTIONS\opencode"
$SERVER_DIR = "$ROOT\packages\server"
$DASHBOARD_DIR = "$ROOT\packages\dashboard"
$AGENT_DIR = "$env:USERPROFILE\.opencode\hub"
$HUB_DATA = "$SERVER_DIR\data\hub.db"

switch ($Command) {
    "up" {
        Write-Host "`n==> Starting OpenCode Hub..." -ForegroundColor Cyan

        $health = try { (Invoke-WebRequest "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2).StatusCode } catch { $null }
        if ($health -eq 200) { Write-Host "  Server: already running" -ForegroundColor Yellow }
        else {
            $p = Start-Process -WindowStyle Hidden -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "--import","tsx/esm","src/index.ts" -WorkingDirectory $SERVER_DIR
            Write-Host "  Server: started (PID $($p.Id))" -ForegroundColor Green
        }

        $dash = try { (Invoke-WebRequest "http://localhost:5173" -UseBasicParsing -TimeoutSec 2).StatusCode } catch { $null }
        if ($dash -eq 200) { Write-Host "  Dashboard: already running" -ForegroundColor Yellow }
        else {
            Start-Sleep -Seconds 4
            $d = Start-Process -WindowStyle Hidden -FilePath "C:\Program Files\nodejs\npx.cmd" -ArgumentList "vite","--port","5173" -WorkingDirectory $DASHBOARD_DIR
            Start-Sleep -Seconds 4
            Write-Host "  Dashboard: started (PID $($d.Id))" -ForegroundColor Green
        }

        Start-Sleep -Seconds 2
        $ok = try { (Invoke-WebRequest "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200 } catch { $false }
        $dok = try { (Invoke-WebRequest "http://localhost:5173" -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200 } catch { $false }

        Write-Host ""
        if ($ok -and $dok) {
            Write-Host "  Ready!" -ForegroundColor Green
            Write-Host "  Server:    http://localhost:3000"
            Write-Host "  Dashboard: http://localhost:5173"
        } else {
            Write-Host "  Server: $(if($ok){'OK'}else{'FAIL'}) | Dashboard: $(if($dok){'OK'}else{'FAIL'})"
        }
    }

    "stop" {
        Write-Host "`n==> Stopping Hub..." -ForegroundColor Yellow
        $pids3000 = netstat -ano | Select-String ":3000 " | Select-String "LISTEN" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -Unique
        foreach ($p in $pids3000) { if ($p -gt 0) { try { Stop-Process -Id $p -Force -ErrorAction Stop; Write-Host "  Killed PID $p (port 3000)" -f Green } catch {} } }
        $pids5173 = netstat -ano | Select-String ":5173 " | Select-String "LISTEN" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -Unique
        foreach ($p in $pids5173) { if ($p -gt 0) { try { Stop-Process -Id $p -Force -ErrorAction Stop; Write-Host "  Killed PID $p (port 5173)" -f Green } catch {} } }
        Write-Host "  Hub stopped" -ForegroundColor Green
    }

    "status" {
        Write-Host "`n==> Hub Status" -ForegroundColor Cyan
        try { $h = Invoke-WebRequest "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop; $b = $h.Content | ConvertFrom-Json; Write-Host "  Server: OK (machines: $($b.machines_online))" -f Green }
        catch { Write-Host "  Server: OFFLINE" -f Red }
        try { Invoke-WebRequest "http://localhost:5173" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop | Out-Null; Write-Host "  Dashboard: OK" -f Green }
        catch { Write-Host "  Dashboard: OFFLINE" -f Red }

        if (Test-Path "$env:USERPROFILE\.config\opencode\plugins\hub-telemetry.ts") { Write-Host "  Plugin: installed" -f Green }
        else { Write-Host "  Plugin: missing" -f Red }

        if (Test-Path $HUB_DATA) { $sz = [math]::Round((Get-Item $HUB_DATA).Length / 1KB, 1); Write-Host "  DB: $sz KB" -f Green }

        $startup = [Environment]::GetFolderPath("Startup")
        if (Test-Path (Join-Path $startup "OpenCodeHub.lnk")) { Write-Host "  Auto-start: Startup folder" -f Green }
        else { Write-Host "  Auto-start: not configured" -f Yellow }
    }

    "restart" {
        & $MyInvocation.MyCommand.Path "stop"
        Start-Sleep -Seconds 2
        & $MyInvocation.MyCommand.Path "up"
    }
}
