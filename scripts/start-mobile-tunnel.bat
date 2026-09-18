@echo off
title Sama Al-Khadraa Mobile Tunnel
echo ============================================================
echo    SAMA AL-KHADRAA MOBILE TUNNEL (CLOUDFLARE)
echo ============================================================
echo Starting Cloudflare Tunnel for http://localhost:3000...
echo.
"%~dp0..\cloudflared.exe" tunnel --url http://localhost:3000
pause
