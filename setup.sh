#!/bin/bash

# Fuel App Setup Script
echo " Setting up Fuel Pre-Order App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo " Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo " Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo " Node.js $(node -v) detected"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "  MongoDB is not installed. Please install MongoDB first."
    echo "   Visit: https://docs.mongodb.com/manual/installation/"
fi

# Install root dependencies
echo " Installing root dependencies..."
npm install

# Install backend dependencies
echo " Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo " Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment files
echo "  Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo " Created backend/.env from template"
    echo "  Please update backend/.env with your API keys"
else
    echo " backend/.env already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo " Created frontend/.env from template"
    echo "  Please update frontend/.env with your API keys"
else
    echo " frontend/.env already exists"
fi

# Create necessary directories
echo " Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p frontend/android/app/src/main/assets

echo " Setup completed!"
echo ""
echo " Next steps:"
echo "1. Update environment files with your API keys:"
echo "   - backend/.env"
echo "   - frontend/.env"
echo ""
echo "2. Start MongoDB (if not already running):"
echo "   mongod"
echo ""
echo "3. Seed the database:"
echo "   cd backend && npm run seed"
echo ""
echo "4. Start the development servers:"
echo "   npm run dev"
echo ""
echo "5. For React Native development:"
echo "   cd frontend"
echo "   npx react-native run-android  # for Android"
echo "   npx react-native run-ios      # for iOS"
echo ""
echo " Documentation: http://localhost:3000/docs"
echo " Happy coding!"
