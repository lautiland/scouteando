#!/bin/bash

echo "🌐 Probando el build de Netlify localmente..."

cd frontend

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Construyendo aplicación para Netlify..."
npm run build -- --configuration=netlify

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
    
    if [ -f "dist/scouteando/_redirects" ]; then
        echo "✅ _redirects presente"
        echo "📄 Contenido de _redirects:"
        cat dist/scouteando/_redirects
    else
        echo "❌ _redirects no encontrado"
    fi
    
    if [ -d "dist/scouteando/assets/content" ]; then
        echo "✅ Directorio assets/content presente"
        
        if [ -f "dist/scouteando/assets/content/categories.json" ]; then
            echo "✅ categories.json presente"
        else
            echo "❌ categories.json no encontrado"
        fi
        
        echo "📂 Contenido en assets/content:"
        ls -la dist/scouteando/assets/content/
    else
        echo "❌ Directorio assets/content no encontrado"
    fi
    
    echo "🌐 Para probar localmente, ejecuta:"
    echo "cd dist/scouteando && python3 -m http.server 3000 --bind 127.0.0.1"
    echo "Luego visita: http://127.0.0.1:3000/"
    
else
    echo "❌ Error: No se generó el directorio dist/scouteando"
    exit 1
fi

echo "✅ Build para Netlify completado exitosamente"
