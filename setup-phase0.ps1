$ErrorActionPreference = "Stop"
function Invoke-Npm { param([Parameter(Mandatory = $true)][string[]]$Arguments); & npm @Arguments; if ($LASTEXITCODE -ne 0) { throw "npm $($Arguments -join ' ') failed with exit code $LASTEXITCODE" } }
Write-Host "Removing incompatible plugin entry from a previous failed attempt..." -ForegroundColor Cyan
& npm pkg delete "devDependencies.@vitejs/plugin-react"
if ($LASTEXITCODE -ne 0) { throw "Could not clean package.json" }
Write-Host "Installing Reperto Phase 0 dependencies..." -ForegroundColor Cyan
Invoke-Npm @("install", "next-themes")
Invoke-Npm @("install", "--save-dev", "vitest@3.2.4", "jsdom@26.1.0", "@testing-library/react@16.3.0", "@testing-library/jest-dom@6.9.1", "@testing-library/user-event@14.6.1")
Write-Host "Adding package scripts..." -ForegroundColor Cyan
Invoke-Npm @("pkg", "set", "scripts.lint=eslint")
Invoke-Npm @("pkg", "set", "scripts.typecheck=tsc --noEmit")
Invoke-Npm @("pkg", "set", "scripts.test=vitest run")
Invoke-Npm @("pkg", "set", "scripts.test:watch=vitest")
Invoke-Npm @("pkg", "set", "scripts.build=next build")
Write-Host "Phase 0 dependencies and scripts configured." -ForegroundColor Green
