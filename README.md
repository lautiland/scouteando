# 🔍 Scouteando

**Una aplicación web para explorar y aprender sobre el movimiento scout**

Aplicación fullstack construida con Angular 18 (frontend) y Strapi 5 (backend) que proporciona contenido educativo sobre técnicas scout, historia, organización y valores del escultismo.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v18 o superior)
- npm

### Instalación y Ejecución

```bash
# Clonar el proyecto
git clone <repo-url>
cd scouteando

# Instalar todas las dependencias
npm install

# Iniciar ambos servidores (frontend + backend)
npm start
```

### URLs de Desarrollo
- **Frontend**: http://localhost:4200/scouteando
- **Backend Admin**: http://localhost:1337/admin  
- **Backend API**: http://localhost:1337/api

## 🛠️ Comandos Disponibles

### Desde la raíz del proyecto
```bash
npm start                 # Iniciar frontend y backend
npm run frontend:start    # Solo frontend
npm run backend:start     # Solo backend
npm run build            # Compilar ambos para producción
npm install              # Instalar dependencias
```

### Frontend (desde `frontend/`)
```bash
ng serve                 # Servidor de desarrollo
ng build                # Compilar para producción
ng test                 # Ejecutar tests
```

### Backend (desde `backend/`)
```bash
npm run dev             # Servidor de desarrollo
npm start               # Servidor de producción
npm run console         # Consola de Strapi
```

## 🏗️ Estructura del Proyecto

```
scouteando/
├── frontend/           # Angular 18
│   ├── src/app/       # Componentes y servicios
│   └── src/assets/    # Recursos estáticos
├── backend/           # Strapi 5 CMS
│   ├── src/           # APIs y contenido
│   └── config/        # Configuración
└── package.json       # Scripts del workspace
```

## 🎯 Tecnologías Utilizadas

- **Frontend**: Angular 18, TypeScript, Bootstrap 5
- **Backend**: Strapi 5, Node.js, SQLite
- **Herramientas**: VS Code workspace configurado

## 🚢 Despliegue

```bash
# Frontend (GitHub Pages)
npm run frontend:deploy

# Backend: Configurado para Render.com
# Ver variables de entorno en .env
```

## 📚 Recursos

- [Angular Docs](https://angular.dev/)
- [Strapi Docs](https://docs.strapi.io/)
- [Bootstrap Docs](https://getbootstrap.com/)
