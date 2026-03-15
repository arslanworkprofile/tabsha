# ============================================
# Tabsha Custom Design - Windows Setup Script
# Run this from the tabsha/ folder in PowerShell
# ============================================

Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "All dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Copy backend/.env.example to backend/.env"
Write-Host "  2. Edit backend/.env with your MongoDB URI and Cloudinary keys"
Write-Host "  3. Run: node backend/seed.js"
Write-Host "  4. Run: npm run dev"
