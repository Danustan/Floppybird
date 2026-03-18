#!/bin/bash

# Green Justice Installation Script
# This script sets up the entire Green Justice application

echo "🌱 Green Justice - Installation Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Create backend environment file
echo -e "\n📝 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend .env file"
    echo "⚠️  Please edit backend/.env with your database credentials"
else
    echo "✅ backend/.env already exists"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Error installing backend dependencies"
    exit 1
fi

# Create frontend environment file
echo -e "\n📝 Setting up Frontend..."
cd ../frontend

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend .env file"
else
    echo "✅ frontend/.env already exists"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Error installing frontend dependencies"
    exit 1
fi

echo -e "\n✅ Installation Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Run: mysql -u root -p < backend/database/schema.sql"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "🌍 Visit http://localhost:3000 in your browser"
echo ""
echo "Made with 🌱 for environmental protection"
