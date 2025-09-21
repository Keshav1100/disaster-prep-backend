#!/bin/bash

echo "🚀 Starting Disaster Management Backend..."
echo "📍 Current directory: $(pwd)"
echo "📁 Checking files..."

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found, using defaults"
else
    echo "✅ .env file found"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting server..."
node server.js