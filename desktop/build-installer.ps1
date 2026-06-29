$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$tempDist = Join-Path $env:LOCALAPPDATA "Temp\wan2gp-desktop-dist"
$finalDist = Join-Path $projectRoot "dist"
$pkg = Get-Content (Join-Path $projectRoot "package.json") -Raw | ConvertFrom-Json
$productName = $pkg.build.productName
$version = $pkg.version
$setupName = "$productName-$version-Setup.exe"

if (Test-Path $tempDist) {
  Remove-Item -LiteralPath $tempDist -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Force -Path $tempDist | Out-Null
New-Item -ItemType Directory -Force -Path $finalDist | Out-Null

Push-Location $projectRoot
try {
  & .\node_modules\.bin\electron-builder.cmd --win nsis "--config.directories.output=$tempDist"
  if ($LASTEXITCODE -ne 0) {
    throw "electron-builder failed with exit code $LASTEXITCODE"
  }

  Copy-Item -LiteralPath (Join-Path $tempDist $setupName) -Destination $finalDist -Force
  Copy-Item -LiteralPath (Join-Path $tempDist "$setupName.blockmap") -Destination $finalDist -Force
  Copy-Item -LiteralPath (Join-Path $tempDist "latest.yml") -Destination $finalDist -Force
}
finally {
  Pop-Location
}
