<#
.SYNOPSIS
  Busca noticias de IA das ultimas 24h do Hacker News, resume cada uma,
  e cola no Sticky Notes com titulo + resumo em portugues.
#>

$text = ""

function Write-Log { param([string]$Msg) Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Msg" }

function Get-MetaDescription {
    param([string]$Url)
    try {
        $html = Invoke-WebRequest -Uri $Url -TimeoutSec 8 -UseBasicParsing
        if ($html.Content -match '<meta\s+[^>]*name=["'']description["''][^>]*content=["'']([^"'']+)["'']') {
            return $matches[1] -replace '\s+', ' '
        }
        if ($html.Content -match '<meta\s+[^>]*property=["'']og:description["''][^>]*content=["'']([^"'']+)["'']') {
            return $matches[1] -replace '\s+', ' '
        }
    } catch {}
    return $null
}

Write-Log "Iniciando busca de noticias IA..."

# ===== 1. Buscar noticias do Hacker News =====
$storyIds = try {
    (Invoke-RestMethod "https://hacker-news.firebaseio.com/v0/newstories.json" -TimeoutSec 15)[0..79]
} catch {
    Write-Log "ERRO ao acessar Hacker News: $_"
    @()
}

$stories = @()

if ($storyIds.Count -gt 0) {
    $aiKeywords = @("ai", "artificial intelligence", "machine learning", "deep learning", "llm", "gpt",
        "openai", "anthropic", "claude", "gemini", "deepseek", "llama", "mistral",
        "neural", "transformer", "copilot", "chatgpt", "token", "agi", "nvidia",
        "language model", "fine.tun", "inference", "rag", "agent")

    foreach ($id in $storyIds) {
        try {
            $story = Invoke-RestMethod "https://hacker-news.firebaseio.com/v0/item/$id.json" -TimeoutSec 5
            $titleLower = ($story.title -join " ").ToLower()
            $matches = $aiKeywords | Where-Object { $titleLower -match $_.ToLower() }
            if ($matches) {
                $resumo = $null
                if ($story.url) {
                    $resumo = Get-MetaDescription -Url $story.url
                } elseif ($story.text) {
                    $resumo = ($story.text -replace '<[^>]+>', '') -replace '\s+', ' '
                    if ($resumo.Length -gt 250) { $resumo = $resumo.Substring(0, 250) + "..." }
                }
                $stories += [PSCustomObject]@{
                    Title  = $story.title
                    Url    = $story.url
                    Score  = if ($story.score) { $story.score } else { 0 }
                    Resume = $resumo
                }
            }
        } catch { continue }
    }

    $stories = $stories | Sort-Object Score -Descending | Select-Object -First 8
}

# ===== 2. Montar texto em PT-BR =====
$line = "=" * 50
$text = @"
$line
   NOTICIAS DE IA - $(Get-Date -Format 'dd/MM/yyyy (HH:mm)')
$line

"@

if ($stories.Count -eq 0) {
    $text += "Nenhuma noticia de IA encontrada nas ultimas 24h.`n`nConfira em: https://news.ycombinator.com/"
} else {
    $text += "Top $($stories.Count) noticias de IA:`n`n"
    $i = 1
    foreach ($s in $stories) {
        $text += "$i. $($s.Title)`n"
        if ($s.Resume) { $text += "   Resumo: $($s.Resume)`n" }
        if ($s.Url) { $text += "   Link: $($s.Url)`n" }
        if ($s.Score -gt 0) { $text += "   (👍 $($s.Score) pontos)`n" }
        $text += "`n"
        $i++
    }
    $text += "$line`nFonte: Hacker News API | Resumo gerado automaticamente"
}

Write-Log "$($stories.Count) noticias encontradas."

# ===== 3. Criar nota =====
$done = $false

try {
    Write-Log "Abrindo Sticky Notes..."
    Start-Process "shell:AppsFolder\Microsoft.MicrosoftStickyNotes_8wekyb3d8bbwe!App"
    Start-Sleep 4

    Add-Type -AssemblyName System.Windows.Forms
    $wshell = New-Object -ComObject wscript.shell

    for ($attempt = 0; $attempt -lt 5; $attempt++) {
        $focused = $wshell.AppActivate("Sticky Notes")
        if ($focused) { break }
        Start-Sleep 1
    }

    Start-Sleep 1.5
    [System.Windows.Forms.SendKeys]::SendWait("^{n}")
    Start-Sleep 2

    Set-Clipboard -Value $text
    Start-Sleep 0.5
    [System.Windows.Forms.SendKeys]::SendWait("^{v}")

    Write-Log "Nota criada no Sticky Notes!"
    $done = $true
} catch {
    Write-Log "Sticky Notes nao disponivel: $_"
}

if (-not $done) {
    $desktop = [Environment]::GetFolderPath("Desktop")
    $file = Join-Path $desktop "Resumo IA $(Get-Date -Format 'yyyy-MM-dd').txt"
    $text | Out-File -FilePath $file -Encoding UTF8
    Write-Log "Nota salva em: $file"
    $done = $true
}

Write-Log "Concluido!"
