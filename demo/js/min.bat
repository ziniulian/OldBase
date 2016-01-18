@echo off
setlocal EnableDelayedExpansion
set /p str=«Î ‰»Î¬∑æ∂£∫

for /f %%i in ('dir /b /s %str% ^| findstr /v "old test expand" ^| findstr "\.js$ \.css$"') do (
	set var=%%~dpi
	set var=..\..\min\js!var:%cd%=!

	if not exist !var! md !var!
	java -jar compiler.jar --js %%~i --js_output_file !var!%%~nxi
	echo !var!%%~nxi
)

echo --------------------------- END
pause
