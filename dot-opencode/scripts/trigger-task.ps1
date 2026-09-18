param(
    [Parameter(Mandatory)]
    [string]$TaskId
)

function Write-Log { param([string]$M) Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $M" }

$pendingFile = "C:\Users\User\.opencode\tasks\pending\$TaskId.json"
if (-not (Test-Path $pendingFile)) {
    Write-Log "ERRO: pending nao encontrado: $pendingFile"
    exit 1
}

$task = Get-Content $pendingFile -Raw | ConvertFrom-Json

$command = "#task $TaskId"
$cmd = "opencode --agent task-runner --prompt `"$command`""

Write-Log "Acordando agente: $command"
Start-Process "cmd" -ArgumentList "/c $cmd"
Write-Log "Comando: $cmd"
