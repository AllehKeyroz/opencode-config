<#
.SYNOPSIS
    Instala as configuracoes personalizadas do OpenCode a partir deste repo.

.DESCRIPTION
    Copia config/ -> ~/.config/opencode, dot-opencode/ -> ~/.opencode e
    skills/ -> ~/.agents/skills, fazendo backup do que ja existir.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\install.ps1
    powershell -ExecutionPolicy Bypass -File .\install.ps1 -NoBackup
#>

param(
    [switch]$NoBackup,
    [switch]$InstallDeps
)

$ErrorActionPreference = "Stop"
$Repo = Split-Path -Parent $MyInvocation.MyCommand.Path

$ConfigDir = Join-Path $env:USERPROFILE ".config\opencode"
$DotOpenCodeDir = Join-Path $env:USERPROFILE ".opencode"
$SkillsDir = Join-Path $env:USERPROFILE ".agents\skills"

function Backup-Dir([string]$Path) {
    if (-not $NoBackup -and (Test-Path -LiteralPath $Path)) {
        $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $bak = "$Path.bak-$stamp"
        Write-Host "  backup: $Path -> $bak" -ForegroundColor Yellow
        Move-Item -LiteralPath $Path -Destination $bak
    }
}

function Merge-Dir([string]$Source, [string]$Dest, [string]$Label) {
    if (-not (Test-Path -LiteralPath $Source)) { return }
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
    Write-Host "  instalando $Label -> $Dest" -ForegroundColor Cyan
    robocopy $Source $Dest /E /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy falhou ($LASTEXITCODE) para $Label" }
}

Write-Host "`n==> Instalando OpenCode Config (Keyroz)" -ForegroundColor Cyan

Backup-Dir $ConfigDir
Backup-Dir $DotOpenCodeDir
Backup-Dir $SkillsDir

Merge-Dir (Join-Path $Repo "config") $ConfigDir "config"
Merge-Dir (Join-Path $Repo "dot-opencode") $DotOpenCodeDir "dot-opencode"
Merge-Dir (Join-Path $Repo "skills") $SkillsDir "skills"

if ($InstallDeps) {
    Write-Host "`n==> Instalando dependencias" -ForegroundColor Cyan
    Push-Location $ConfigDir
    if (Test-Path "package.json") { npm install }
    Pop-Location

    $Antigravity = Join-Path $ConfigDir "plugins\opencode-antigravity-image"
    if (Test-Path $Antigravity) {
        Push-Location $Antigravity
        if (Get-Command bun -ErrorAction SilentlyContinue) {
            bun install
            bun build src/index.ts --outdir dist --target node
        } else {
            npm install
            Write-Host "  bun nao encontrado - rode 'bun build src/index.ts --outdir dist --target node' manualmente" -ForegroundColor Yellow
        }
        Pop-Location
    }

    $Gbp = Join-Path $DotOpenCodeDir "tools\gbp-manager"
    if (Test-Path $Gbp) {
        Push-Location $Gbp
        npm install
        Pop-Location
    }
}

Write-Host "`n==> Proximos passos" -ForegroundColor Cyan
Write-Host "1. Copie .env.example para $ConfigDir\.env e preencha as chaves reais."
Write-Host "2. Ajuste caminhos com C:\Users\User\ se o usuario for diferente."
Write-Host "3. Reinicie o OpenCode."
Write-Host "`nConcluido." -ForegroundColor Green
