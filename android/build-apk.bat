@echo off
title Build Sama Al-Khadraa Android APK
echo ============================================================
echo   BUILDING SAMA AL-KHADRAA ANDROID APK (DEBUG)
echo ============================================================
echo.

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d "%~dp0"

echo Running Gradle assembleDebug...
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo   BUILD SUCCESSFUL!
    echo   APK Location: app\build\outputs\apk\debug\app-debug.apk
    echo ============================================================
) else (
    echo.
    echo Build failed. If Android SDK is not configured, please open the 'android' folder in Android Studio.
)

pause
