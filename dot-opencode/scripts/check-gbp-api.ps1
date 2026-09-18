$ErrorActionPreference = 'Stop'
$secretsDir = "$env:USERPROFILE\.opencode\secrets"
$tokenFile = "$secretsDir\gbp-token.json"
$credsFile = "$secretsDir\gbp-credentials.json"
$logFile = "$env:USERPROFILE\.opencode\tasks\gbp-api-check.log"

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "[$timestamp] Iniciando verificacao..."

# Load current token
if (-not (Test-Path $tokenFile)) {
  Add-Content -Path $logFile -Value "[$timestamp] ERRO: Token nao encontrado"
  exit 1
}

$tokenData = Get-Content $tokenFile | ConvertFrom-Json
$creds = Get-Content $credsFile | ConvertFrom-Json

# Check if token is expired
$now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
if ($tokenData.expiry_date -le $now) {
  Add-Content -Path $logFile -Value "[$timestamp] Token expirado. Renovando..."
  $body = @{
    client_id = $creds.clientId
    client_secret = $creds.clientSecret
    refresh_token = $tokenData.refresh_token
    grant_type = "refresh_token"
  }
  try {
    $r = Invoke-RestMethod -Uri "https://oauth2.googleapis.com/token" -Method Post -Body $body
    $tokenData.access_token = $r.access_token
    $tokenData.expiry_date = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() + ($r.expires_in * 1000)
    if ($r.refresh_token) { $tokenData.refresh_token = $r.refresh_token }
    $tokenData | ConvertTo-Json | Set-Content $tokenFile
    Add-Content -Path $logFile -Value "[$timestamp] Token renovado com sucesso"
  } catch {
    $errBody = $_.Exception.Response
    if ($errBody.StatusCode -eq 400) {
      $reader = New-Object System.IO.StreamReader($errBody.GetResponseStream())
      $bodyText = $reader.ReadToEnd() | ConvertFrom-Json
      Add-Content -Path $logFile -Value "[$timestamp] ERRO 400: $($bodyText.error_description) - Refresh token expirou. Re-autentique."
    } else {
      Add-Content -Path $logFile -Value "[$timestamp] ERRO renovacao token ($($errBody.StatusCode.value__)): $_"
    }
    exit 1
  }
}

# Test GBP API
$headers = @{ Authorization = "Bearer $($tokenData.access_token)" }
try {
  $accts = Invoke-RestMethod -Uri "https://mybusinessaccountmanagement.googleapis.com/v1/accounts" -Headers $headers
  if ($accts.accounts -and $accts.accounts.Count -gt 0) {
    Add-Content -Path $logFile -Value "[$timestamp] SUCESSO! Contas GBP encontradas: $($accts.accounts.Count)"
    Add-Content -Path $logFile -Value "[$timestamp] DETALHES: $($accts.accounts | ConvertTo-Json -Compress)"
    
    # Notify user
    $notification = New-Object -ComObject Wscript.Shell
    $notification.Popup("GBP API LIBERADA! $($accts.accounts.Count) conta(s) encontrada(s). Verifique o log.", 10, "GBP API - Sucesso", 64)
  } else {
    Add-Content -Path $logFile -Value "[$timestamp] API respondeu mas sem contas: $($accts | ConvertTo-Json -Compress)"
  }
} catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $bodyText = $reader.ReadToEnd()
  if ($statusCode -eq 429) {
    Add-Content -Path $logFile -Value "[$timestamp] QUOTA NAO LIBERADA (429). Aguardando aprovacao do Google."
  } elseif ($statusCode -eq 403) {
    Add-Content -Path $logFile -Value "[$timestamp] PERMISSAO NEGADA (403): API nao ativada no console.cloud.google.com"
    Add-Content -Path $logFile -Value "[$timestamp] Detalhe: $bodyText"
  } elseif ($statusCode -eq 400) {
    Add-Content -Path $logFile -Value "[$timestamp] TOKEN INVALIDO (400): Re-autentique."
    Add-Content -Path $logFile -Value "[$timestamp] Detalhe: $bodyText"
  } else {
    Add-Content -Path $logFile -Value "[$timestamp] ERRO $statusCode : $bodyText"
  }
}
