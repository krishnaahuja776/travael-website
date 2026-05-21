@echo off
cd /d "%~dp0"
echo Running MongoDB Seed Script...
npm run seed
pause
