# Force kill any existing java processes
try { taskkill /f /im java.exe } catch { }

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:GRADLE_USER_HOME = "C:\Aplikasi\G" # Shorter path
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Ensure the local gradle home exists
if (-not (Test-Path $env:GRADLE_USER_HOME)) {
    New-Item -ItemType Directory -Force -Path $env:GRADLE_USER_HOME
}

Set-Location android
# Run with --no-daemon to avoid file locks and --stacktrace for better debugging
.\gradlew.bat clean
.\gradlew.bat assembleDebug --no-daemon
