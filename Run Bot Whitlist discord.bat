@echo off

REM ตั้งรหัสภาษาเป็น UTF-8
chcp 65001 >nul

cd /d "C:\Users\JJJJJMMMY\Desktop\Bot Discord"

REM รัน node พร้อมแสดงผล realtime และเก็บ log ไปพร้อมกัน
powershell -Command "node --trace-warnings index.js 2>&1 | Tee-Object -FilePath bot.log -Append"

pause
