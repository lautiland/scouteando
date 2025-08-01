#!/bin/bash

echo "🧪 Testing Content System..."
echo "==============================="

# Test básico de URLs del frontend
echo ""
echo "📊 Frontend Tests:"
echo "-------------------"

# Test página principal
if curl -s http://localhost:4200/scouteando | grep -q "Scouteando" 2>/dev/null; then
    echo "✅ Homepage accessible"
else
    echo "❌ Homepage not accessible"
fi

# Test archivos de contenido
echo ""
echo "📄 Content Files Tests:"
echo "------------------------"

CONTENT_BASE="/home/lautaro/Public/codigo/scouteando/frontend/src/assets/content"

# Test categories.json
if [ -f "$CONTENT_BASE/categories.json" ]; then
    echo "✅ categories.json exists"
    CATEGORIES=$(jq -r '.categories | length' "$CONTENT_BASE/categories.json" 2>/dev/null)
    if [ "$CATEGORIES" -gt 0 ]; then
        echo "✅ Found $CATEGORIES categories"
    else
        echo "❌ No categories found"
    fi
else
    echo "❌ categories.json missing"
fi

# Test categorías específicas
for CATEGORY in espiritu historia organizacion tecnica; do
    if [ -d "$CONTENT_BASE/$CATEGORY" ]; then
        echo "✅ Category folder: $CATEGORY"
        
        if [ -f "$CONTENT_BASE/$CATEGORY/index.json" ]; then
            ARTICLES=$(jq -r '.articles | length' "$CONTENT_BASE/$CATEGORY/index.json" 2>/dev/null)
            if [ "$ARTICLES" -gt 0 ]; then
                echo "  📚 $ARTICLES articles found"
            else
                echo "  ⚠️ No articles in index"
            fi
        else
            echo "  ❌ index.json missing"
        fi
    else
        echo "❌ Category folder missing: $CATEGORY"
    fi
done

echo ""
echo "🔧 Backend Tests:"
echo "-------------------"

# Test backend API
if curl -s http://localhost:1337 | grep -q "strapi" 2>/dev/null; then
    echo "✅ Strapi backend accessible"
else
    echo "❌ Strapi backend not accessible"
fi

echo ""
echo "📱 Usage Examples:"
echo "-------------------"
echo "• Frontend: http://localhost:4200/scouteando"
echo "• Category: http://localhost:4200/scouteando/category/espiritu"  
echo "• Backend: http://localhost:1337/admin"
echo ""
echo "💡 Check browser console for content loading logs"
