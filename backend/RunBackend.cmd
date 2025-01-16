@echo off
@REM Program to start the backend application
@REM Inspired by mvnw.cmd

if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo Error: JAVA_HOME not found in your environment. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto init

echo.
echo Error: JAVA_HOME is set to an invalid directory. >&2
echo JAVA_HOME = "%JAVA_HOME%" >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:init
if exist "%cd%\DarkWebScraperServer.jar" goto SetDir

echo.
echo Error: DarkWebScraperServer.jar was not found in the current directory
echo Error: Please ensure DarkWebScraperServer.jar is in the same directory as RunBackend.cmd
echo.
goto error

:SetDir
if not exist "%cd%\data\NUL" mkdir "%cd%\data"

start /d "%cd%\data" "Dark Web Scraper Backend Server Application" "%JAVA_HOME%\bin\java" -jar .\..\DarkWebScraperServer.jar

:error
echo.
set /p temp=Press any key to continue
