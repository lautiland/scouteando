#!/bin/bash

echo "🌐 Build script para Netlify"

# Cambiar al directorio frontend
cd frontend

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Construyendo aplicación..."
npm run build -- --configuration=netlify

echo "📁 Verificando estructura..."
if [ -d "dist/scouteando/browser" ]; then
    echo "📦 Moviendo archivos desde browser/ a la raíz..."
    mv dist/scouteando/browser/* dist/scouteando/
    rm -rf dist/scouteando/browser
    echo "✅ Archivos movidos correctamente"
else
    echo "✅ Los archivos ya están en la ubicación correcta"
fi

echo "📋 Contenido final:"
ls -la dist/scouteando/ | head -10

echo "✅ Build completado para Netlify"
