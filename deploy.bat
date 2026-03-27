@echo off
REM Deploy to Cloudflare Pages
set CLOUDFLARE_API_TOKEN=cfat_T4fAkErhlVFjZbv8AROhLzmLmVIIJjdNT6iXsbIR20b29584
cd /d "%~dp0"
npx wrangler pages deploy . --project-name=nextaura-fit
