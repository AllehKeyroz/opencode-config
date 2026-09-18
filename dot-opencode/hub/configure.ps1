#!/usr/bin/env pwsh
$envName = "HUB_API_URL"
$envValue = "http://localhost:3000"
$current = [Environment]::GetEnvironmentVariable($envName, "User")
if ($current -ne $envValue) {
    [Environment]::SetEnvironmentVariable($envName, $envValue, "User")
    Write-Host "[ENV] $envName = $envValue (set)" -ForegroundColor Green
} else {
    Write-Host "[ENV] $envName already set" -ForegroundColor Yellow
}

$pluginPath = "$env:USERPROFILE\.config\opencode\plugins\hub-telemetry.ts"
if (Test-Path $pluginPath) {
    Write-Host "[Plugin] installed" -ForegroundColor Green
} else {
    Write-Host "[Plugin] MISSING" -ForegroundColor Red
}

$hubPath = "$env:USERPROFILE\.opencode\hub"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$hubPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$hubPath", "User")
    Write-Host "[PATH] hub CLI added" -ForegroundColor Green
} else {
    Write-Host "[PATH] hub CLI already in PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Configured. Plugin auto-discovers Hub at localhost:3000." -ForegroundColor Green
Write-Host ""
Write-Host "=== RESULTADO ===" -ForegroundColor Cyan
Write-Host "  Hub Server + Dashboard iniciam SILENCIOSOS no login" -ForegroundColor Green
Write-Host "  (via atalho na pasta Startup -> VBScript oculto)" -ForegroundColor Green
Write-Host "  Zero janelas, zero terminais." -ForegroundColor Green
Write-Host ""
Write-Host "Para testar agora: hub up" -ForegroundColor Cyan
Write-Host "Status:            hub status" -ForegroundColor Cyan
Write-Host "Parar:             hub stop" -ForegroundColor Cyan
