# Tool: ghl-search
## Busca no changelog oficial do GoHighLevel
## Uso: opencode ghl-search "termo de busca"

Param(
    [Parameter(Mandatory=$true)]
    [string]$termo
)

$url = "https://ideas.gohighlevel.com/changelog?search=" + [System.Web.HttpUtility]::UrlEncode($termo)

Write-Host "Buscando: $termo no changelog do GHL..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $url -Method Get -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) KeyrozSearch/1.0"
    
    # Extrair titulos e links dos posts do changelog
    $matches = [regex]::Matches($response.Content, '<a[^>]*class="[^"]*changelog[^"]*"[^>]*href="([^"]*)"[^>]*>([^<]*)</a>')
    $matches += [regex]::Matches($response.Content, 'class="changelog-item[^"]*"[^>]*>[\s\S]*?<h3[^>]*>([^<]*)</h3>')
    $matches += [regex]::Matches($response.Content, 'href="(/changelog/[^"]+)"[\s\S]{0,200}?<h[1-3][^>]*>([^<]+)</h[1-3]>')
    
    # Extrair via abordagem mais simples: pegar todos os links do changelog
    $linkMatches = [regex]::Matches($response.Content, 'href="(/changelog/[^"]+)"')
    $titleMatches = [regex]::Matches($response.Content, '<h[1-3][^>]*class="[^"]*changelog[^"]*"[^>]*>([^<]+)</h[1-3]>')
    $h2Matches = [regex]::Matches($response.Content, 'class="changelog-item__title[^"]*"[^>]*>([^<]*)<')
    
    Write-Host "`nResultados para '$termo':" -ForegroundColor Green
    Write-Host "========================" -ForegroundColor Green
    
    $results = @()
    
    # Tentar várias estratégias de extração
    $patterns = @(
        '(?s)<h3[^>]*class="[^"]*changelog-item__title[^"]*"[^>]*>(.*?)</h3>',
        '(?s)<h2[^>]*class="[^"]*"[^>]*>(.*?)</h2>',
        '(?s)class="changelog-item[^"]*"[^>]*>.*?<h[1-3][^>]*>(.*?)</h[1-3>]'
    )
    
    # Estratégia mais confiavel: extrair blocos
    $blocks = [regex]::Split($response.Content, '(?=<div[^>]*class="[^"]*changelog[^"]*")')
    
    $count = 0
    foreach ($block in $blocks) {
        if ($block -match '<h[1-3][^>]*>(.*?)</h[1-3]>' -and $block -match 'href="(/changelog/[^"]+)"') {
            $title = $matches[1]
            $link = $matches[1]
            
            # Extrair data
            $date = ""
            if ($block -match '(\d+ \w+ \d{4})|(\w+ \d+, \d{4})') {
                $date = $matches[0]
            }
            
            # Extrair descricao
            $desc = ""
            if ($block -match '<p[^>]*>(.*?)</p>') {
                $desc = $matches[1] -replace '<[^>]+>', ''
                if ($desc.Length -gt 150) { $desc = $desc.Substring(0, 150) + "..." }
            }
            
            if ($title -match $termo -or $desc -match $termo) {
                $results += [PSCustomObject]@{
                    Titulo = $title
                    Link = "https://ideas.gohighlevel.com$link"
                    Data = $date
                    Descricao = $desc
                }
                $count++
            }
        }
    }
    
    if ($count -eq 0) {
        # Fallback: extrair de forma mais simples
        $titlePattern = [regex]::Matches($response.Content, '<h[1-3][^>]*>([^<]*(?i)$termo[^<]*)</h[1-3]>')
        foreach ($m in $titlePattern) {
            $results += [PSCustomObject]@{
                Titulo = $m.Groups[1].Value
                Link = $url
                Data = ""
                Descricao = ""
            }
            $count++
        }
    }
    
    if ($count -eq 0) {
        Write-Host "Nenhum resultado encontrado para '$termo'." -ForegroundColor Yellow
        Write-Host "Tente um termo diferente ou veja o changelog completo em:" -ForegroundColor Yellow
        Write-Host "https://ideas.gohighlevel.com/changelog" -ForegroundColor Cyan
    } else {
        $results | Format-Table -AutoSize
    }
    
    Write-Host "`nFonte: $url" -ForegroundColor DarkGray
    
} catch {
    Write-Host "Erro ao buscar changelog: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Tente acessar diretamente: https://ideas.gohighlevel.com/changelog" -ForegroundColor Cyan
}
