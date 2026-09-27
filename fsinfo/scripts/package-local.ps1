param(
  [string]$DestinationRoot = "C:\tp\rc\FSInfo"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$StageRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("fsinfo-package-" + [guid]::NewGuid().ToString("N"))
$StageSource = Join-Path $StageRoot "01-unbuilt"
$StageBuild = Join-Path $StageRoot "02-built-upload"
$SourceOut = Join-Path $DestinationRoot "01-unbuilt"
$BuildOut = Join-Path $DestinationRoot "02-built-upload"

Write-Host "FSInfo packaging"
Write-Host "Project: $ProjectRoot"
Write-Host "Destination: $DestinationRoot"

if (-not $env:ComSpec) {
  $env:ComSpec = Join-Path $env:SystemRoot "System32\cmd.exe"
}
$env:COMSPEC = $env:ComSpec

New-Item -ItemType Directory -Force $DestinationRoot | Out-Null
New-Item -ItemType Directory -Force $StageSource | Out-Null
New-Item -ItemType Directory -Force $StageBuild | Out-Null

Push-Location $ProjectRoot
try {
  if (Test-Path (Join-Path $ProjectRoot "package-lock.json")) {
    npm ci --ignore-scripts --no-audit --no-fund
  } else {
    npm install --no-audit --no-fund
  }
  if ($LASTEXITCODE -ne 0) { throw "dependency install failed with code $LASTEXITCODE" }

  npm run check
  if ($LASTEXITCODE -ne 0) { throw "typecheck failed with code $LASTEXITCODE" }

  npm run build
  if ($LASTEXITCODE -ne 0) { throw "build failed with code $LASTEXITCODE" }

  robocopy $ProjectRoot $StageSource /E /XD node_modules dist ci-logs /XF *.log | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "source staging failed with code $LASTEXITCODE" }

  robocopy (Join-Path $ProjectRoot "dist") $StageBuild /E | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "build staging failed with code $LASTEXITCODE" }
}
finally {
  Pop-Location
}

$commit = "unknown"
try {
  $candidate = (git -C $ProjectRoot rev-parse HEAD 2>$null)
  if ($LASTEXITCODE -eq 0 -and $candidate) { $commit = $candidate.Trim() }
} catch {}

$stageFiles = Get-ChildItem $StageBuild -File -Recurse
if (-not $stageFiles) { throw "staged production output is empty" }

if (Test-Path $SourceOut) { Remove-Item $SourceOut -Recurse -Force }
if (Test-Path $BuildOut) { Remove-Item $BuildOut -Recurse -Force }
Move-Item $StageSource $SourceOut
Move-Item $StageBuild $BuildOut

@"
FSInfo delivery package
Built/verified: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Verified source commit: $commit

01-unbuilt
==========
Editable source package:
$SourceOut

02-built-upload
===============
Production static output.
Verified file count: $($stageFiles.Count)

UPLOAD THIS
===========
Upload ONLY THE CONTENTS OF:
$BuildOut

to the host directory serving:
https://modiremelli.ir/fsinfo/

Do not upload 01-unbuilt, node_modules, repository metadata, or development files as public content.
"@ | Set-Content -Encoding UTF8 (Join-Path $DestinationRoot "README-UPLOAD.txt")

if (Test-Path $StageRoot) { Remove-Item $StageRoot -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "Done."
Write-Host "SOURCE: $SourceOut"
Write-Host "UPLOAD THIS: $BuildOut"
