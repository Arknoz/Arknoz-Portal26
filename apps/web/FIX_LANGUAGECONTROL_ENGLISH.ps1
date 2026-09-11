$ErrorActionPreference = "Stop"

$target = (Get-Location).Path

if (-not (Test-Path (Join-Path $target "src\app"))) {
    Write-Host "Run this from C:\Arknoz\apps\web" -ForegroundColor Red
    exit 1
}

$content = @'
export default function LanguageControl({
  compact = false,
  dark = false,
}: {
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <span
      aria-label="English"
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium",
        dark
          ? "border border-white/15 bg-white/5 text-white"
          : "text-slate-700",
      ].join(" ")}
    >
      <span aria-hidden="true">🌐</span>
      <span>{compact ? "EN" : "English"}</span>
    </span>
  );
}
'@

$dest = Join-Path $target "src\components\LanguageControl.tsx"
[System.IO.File]::WriteAllText(
    $dest,
    $content,
    (New-Object System.Text.UTF8Encoding($false))
)

$next = Join-Path $target ".next"
if (Test-Path $next) {
    Remove-Item -Recurse -Force $next
}

Write-Host ""
Write-Host "FIXED: LanguageControl.tsx restored as a normal default React component." -ForegroundColor Green
Write-Host "CLEARED: .next cache" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm.cmd run dev" -ForegroundColor Cyan
