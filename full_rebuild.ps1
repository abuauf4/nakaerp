# Build web → sync to Android → compile APK
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:GRADLE_USER_HOME = "C:\Aplikasi\G"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "=== Step 1: Build Next.js ===" -ForegroundColor Cyan
npm run build

Write-Host "=== Step 2: Sync to Android ===" -ForegroundColor Cyan
npx cap sync android

Write-Host "=== Step 3: Compile APK ===" -ForegroundColor Cyan
try { taskkill /f /im java.exe } catch { }
Set-Location android
.\gradlew.bat assembleDebug --no-daemon

Write-Host "=== Done! ===" -ForegroundColor Green
