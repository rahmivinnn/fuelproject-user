@echo off
echo  Setting up Fuel Pre-Order App...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo  Node.js detected

REM Install root dependencies
echo  Installing root dependencies...
call npm install

REM Install backend dependencies
echo  Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo  Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create environment files
echo  Creating environment files...

REM Backend .env
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo  Created backend\.env from template
    echo  Please update backend\.env with your API keys
) else (
    echo  backend\.env already exists
)

REM Frontend .env
if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env"
    echo  Created frontend\.env from template
    echo  Please update frontend\.env with your API keys
) else (
    echo  frontend\.env already exists
)

REM Create necessary directories
echo  Creating necessary directories...
if not exist "backend\uploads" mkdir "backend\uploads"
if not exist "backend\logs" mkdir "backend\logs"
if not exist "frontend\android\app\src\main\assets" mkdir "frontend\android\app\src\main\assets"

echo  Setup completed!
echo.
echo  Next steps:
echo 1. Update environment files with your API keys:
echo    - backend\.env
echo    - frontend\.env
echo.
echo 2. Start MongoDB (if not already running)
echo.
echo 3. Seed the database:
echo    cd backend ^&^& npm run seed
echo.
echo 4. Start the development servers:
echo    npm run dev
echo.
echo 5. For React Native development:
echo    cd frontend
echo    npx react-native run-android  # for Android
echo    npx react-native run-ios      # for iOS
echo.
echo  Documentation: http://localhost:3000/docs
echo  Happy coding!
pause
