#!/bin/bash

echo "🔍 Checking Scouteando Services Status..."
echo "================================================"

# Check if frontend is running
if curl -s http://localhost:4200 > /dev/null; then
    echo "✅ Frontend (Angular): http://localhost:4200/scouteando"
else
    echo "❌ Frontend (Angular): Not running on port 4200"
fi

# Check if backend is running
if curl -s http://localhost:1337 > /dev/null; then
    echo "✅ Backend (Strapi): http://localhost:1337"
    echo "   Admin Panel: http://localhost:1337/admin"
    echo "   API Base: http://localhost:1337/api"
else
    echo "❌ Backend (Strapi): Not running on port 1337"
fi

echo ""
echo "💡 To start both services: npm start"
echo "💡 To start frontend only: npm run frontend:start"
echo "💡 To start backend only: npm run backend:start"
