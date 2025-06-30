#!/bin/bash

# Frontend deployment preparation script for AWS Amplify
# This script optimizes the React application for production deployment

set -e

echo "🚀 Preparing frontend for AWS Amplify deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v npm &> /dev/null; then
    npm ci
else
    echo "❌ Error: Neither npm nor pnpm found. Please install Node.js and npm."
    exit 1
fi

# Run linting
echo "🔍 Running linter..."
if command -v pnpm &> /dev/null; then
    pnpm run lint
else
    npm run lint
fi

# Build for production
echo "🏗️  Building for production..."
if command -v pnpm &> /dev/null; then
    pnpm run build
else
    npm run build
fi

# Check build output
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found."
    exit 1
fi

echo "📊 Build statistics:"
du -sh dist/
echo "📁 Build contents:"
ls -la dist/

# Optimize images (if any)
echo "🖼️  Checking for image optimization opportunities..."
find dist/ -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l | xargs echo "Images found:"

# Check for large files
echo "⚠️  Checking for large files (>1MB)..."
find dist/ -size +1M -type f -exec ls -lh {} \; | awk '{ print $9 ": " $5 }'

# Validate HTML
echo "✅ Validating build output..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ Error: index.html not found in build output"
    exit 1
fi

# Create deployment summary
echo "📋 Creating deployment summary..."
cat > deployment-summary.txt << EOF
Frontend Deployment Summary
===========================
Build Date: $(date)
Build Size: $(du -sh dist/ | cut -f1)
Node Version: $(node --version)
Package Manager: $(command -v pnpm &> /dev/null && echo "pnpm $(pnpm --version)" || echo "npm $(npm --version)")

Files in build:
$(find dist/ -type f | wc -l) files total

Largest files:
$(find dist/ -type f -exec ls -lh {} \; | sort -k5 -hr | head -5 | awk '{print $9 ": " $5}')

Environment Configuration:
- API Base URL: ${VITE_API_BASE_URL:-"Not set - will use default"}
- App Name: ${VITE_APP_NAME:-"Backgammon Tournament Manager"}
- Debug Mode: ${VITE_ENABLE_DEBUG:-"false"}

Next Steps:
1. Upload this project to your Git repository
2. Connect the repository to AWS Amplify
3. Configure environment variables in Amplify console
4. Deploy the application

EOF

echo "✅ Frontend preparation completed successfully!"
echo ""
echo "📋 Deployment Summary:"
cat deployment-summary.txt
echo ""
echo "🔗 Next steps:"
echo "1. Commit and push your code to Git repository"
echo "2. Set up AWS Amplify app connected to your repository"
echo "3. Configure environment variables in Amplify console"
echo "4. Deploy the application"

