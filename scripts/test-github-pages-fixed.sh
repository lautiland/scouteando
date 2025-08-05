#!/bin/bash

echo "🔍 Probando GitHub Pages localmente..."

cd frontend

echo "📦 Limpiando build anterior..."
rm -rf dist/

echo "🏗️ Construyendo para GitHub Pages..."
npm run build -- --configuration=production

if [ -d "dist/scouteando/browser" ]; then
    echo "📦 Moviendo archivos desde browser/ a la raíz..."
    mv dist/scouteando/browser/* dist/scouteando/
    rm -rf dist/scouteando/browser
fi

echo "📝 Creando archivos necesarios para GitHub Pages..."
touch dist/scouteando/.nojekyll
cp dist/scouteando/index.html dist/scouteando/404.html

echo "📁 Verificando estructura final..."
echo "✅ Archivos en dist/scouteando:"
ls -la dist/scouteando/ | head -10

echo "✅ Contenido verificado:"
if [ -f "dist/scouteando/assets/content/categories.json" ]; then
    echo "✅ categories.json encontrado"
    echo "📄 Primera categoría:"
    cat dist/scouteando/assets/content/categories.json | grep -A 5 '"espiritu"'
else
    echo "❌ categories.json NO encontrado"
fi

echo ""
echo "🌐 Para probar GitHub Pages localmente:"
echo "cd dist/scouteando && python3 -m http.server 8080"
echo "Luego visita: http://127.0.0.1:8080/scouteando/"
echo ""
echo "🔗 URLs de prueba:"
echo "• Home: http://127.0.0.1:8080/scouteando/"
echo "• Espíritu: http://127.0.0.1:8080/scouteando/espiritu"
echo "• Historia: http://127.0.0.1:8080/scouteando/historia"
echo "• Organización: http://127.0.0.1:8080/scouteando/organizacion"
echo "• Técnica: http://127.0.0.1:8080/scouteando/tecnica"
