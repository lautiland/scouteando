#!/bin/bash

echo "🚀 Probando el build de GitHub Pages localmente..."

cd frontend

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Construyendo aplicación..."
npm run build -- --configuration=production --base-href="/scouteando/" --deploy-url="/scouteando/"

echo "📁 Verificando archivos generados..."
if [ -d "dist/scouteando" ]; then
    echo "✅ Directorio dist/scouteando creado"
    
    # Verificar si existe la carpeta browser y mover archivos
    if [ -d "dist/scouteando/browser" ]; then
        echo "📦 Moviendo archivos desde browser/ a la raíz..."
        mv dist/scouteando/browser/* dist/scouteando/
        rm -rf dist/scouteando/browser
    fi
    
    # Verificar archivos importantes
    if [ -f "dist/scouteando/index.html" ]; then
        echo "✅ index.html presente"
    else
        echo "❌ index.html no encontrado"
    fi
    
    if [ -d "dist/scouteando/assets/content" ]; then
        echo "✅ Directorio assets/content presente"
        
        if [ -f "dist/scouteando/assets/content/categories.json" ]; then
            echo "✅ categories.json presente"
            echo "📄 Contenido de categories.json:"
            cat dist/scouteando/assets/content/categories.json
        else
            echo "❌ categories.json no encontrado"
        fi
        
        echo "📂 Archivos en assets/content:"
        ls -la dist/scouteando/assets/content/
    else
        echo "❌ Directorio assets/content no encontrado"
    fi
    
    # Simular archivos necesarios para GitHub Pages
    echo "📝 Creando archivos para GitHub Pages..."
    touch dist/scouteando/.nojekyll
    cp dist/scouteando/index.html dist/scouteando/404.html
    
    echo "🌐 Para probar localmente, ejecuta:"
    echo "cd dist/scouteando && python3 -m http.server 8080 --bind 127.0.0.1"
    echo "Luego visita: http://127.0.0.1:8080/scouteando/"
    
else
    echo "❌ Error: No se generó el directorio dist/scouteando"
    exit 1
fi

echo "✅ Build completado exitosamente"
