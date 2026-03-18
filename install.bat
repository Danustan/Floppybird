@echo off
REM Green Justice Installation Script for Windows

echo.
echo 🌱 Green Justice - Installation Script
echo ========================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm found: %NPM_VERSION%

REM Setup Backend
echo.
echo 📝 Setting up Backend...
cd backend

if not exist .env (
    copy .env.example .env
    echo ✅ Created backend .env file
    echo ⚠️  Please edit backend\.env with your database credentials
) else (
    echo ✅ backend\.env already exists
)

echo 📦 Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error installing backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

REM Setup Frontend
echo.
echo 📝 Setting up Frontend...
cd ..\frontend

if not exist .env (
    copy .env.example .env
    echo ✅ Created frontend .env file
) else (
    echo ✅ frontend\.env already exists
)

echo 📦 Installing frontend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error installing frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

echo.
echo ✅ Installation Complete!
echo.
echo 📋 Next Steps:
echo 1. Edit backend\.env with your database credentials
echo 2. Run: mysql -u root -p ^< backend\database\schema.sql
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend: cd frontend ^&^& npm start
echo.
echo 🌍 Visit http://localhost:3000 in your browser
echo.
echo Made with 🌱 for environmental protection

pause
