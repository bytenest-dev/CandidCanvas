# ─────────────────────────────────────────
#  Candid Canvas BD — Git Push Script
#  Usage: .\push.ps1 "your commit message"
# ─────────────────────────────────────────

param(
    [string]$message = "update: latest changes"
)

$ErrorActionPreference = 'SilentlyContinue'

Write-Host ""
Write-Host "  Staging all changes..." -ForegroundColor Cyan
git add -A

Write-Host "  Committing: $message" -ForegroundColor Cyan
$commitOutput = git commit -m $message 2>&1
Write-Host "  $commitOutput" -ForegroundColor Green

Write-Host "  Pushing to GitHub..." -ForegroundColor Cyan
$pushOutput = git push origin main 2>&1
$pushOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor Green }

Write-Host ""
Write-Host "  Done! Check: https://github.com/bytenest-dev/CandidCanvas/actions" -ForegroundColor Yellow
Write-Host ""
