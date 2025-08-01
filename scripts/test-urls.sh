#!/bin/bash

echo "🌐 Testing Scouteando URLs..."
echo "==============================="

echo ""
echo "🎨 Frontend Tests:"
echo "-------------------"

# Test frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4200/scouteando | grep -q "200"; then
    echo "✅ Frontend accessible: http://localhost:4200/scouteando"
else
    echo "❌ Frontend not accessible on port 4200"
fi

echo ""
echo "⚙️ Backend Tests:"
echo "-------------------"

# Test backend main page
if curl -s -o /dev/null -w "%{http_code}" http://localhost:1337 | grep -q "200"; then
    echo "✅ Backend main page: http://localhost:1337"
else
    echo "❌ Backend not accessible on port 1337"
fi

# Test backend admin
if curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/admin | grep -q "200"; then
    echo "✅ Backend admin panel: http://localhost:1337/admin"
else
    echo "❌ Backend admin not accessible"
fi

# Test backend API
if curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/api | grep -q "200\|404"; then
    echo "✅ Backend API endpoint: http://localhost:1337/api"
else
    echo "❌ Backend API not accessible"
fi

echo ""
echo "📋 Summary:"
echo "------------"
echo "• Frontend (Angular): http://localhost:4200/scouteando"
echo "• Backend Admin (Strapi): http://localhost:1337/admin"
echo "• Backend API: http://localhost:1337/api"
echo ""
echo "💡 For production deployment options, see DEPLOYMENT.md"
echo "💡 To start both services: npm start"
