# Script to launch Cloudflare Tunnel for Sama Al-Khadraa Mobile App
Write-Host "============================================================" -ForegroundColor Green
Write-Host "   SAMA AL-KHADRAA MOBILE TUNNEL (CLOUDFLARE)               " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Green

$cloudflaredPath = Join-Path $PSScriptRoot "..\cloudflared.exe"

if (-not (Test-Path $cloudflaredPath)) {
    Write-Error "cloudflared.exe not found at $cloudflaredPath"
    exit 1
}

Write-Host "Starting Cloudflare Tunnel on http://localhost:3000..." -ForegroundColor Yellow
Write-Host "Copy the https://*.trycloudflare.com URL and paste it into:" -ForegroundColor White
Write-Host "android/app/src/main/res/values/strings.xml -> default_web_url" -ForegroundColor Green
Write-Host "------------------------------------------------------------"

& $cloudflaredPath tunnel --url http://localhost:3000
