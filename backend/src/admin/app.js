const config = {
  locales: [
    'es',
    'en',
  ],
  translations: {
    en: {
      "app.components.LeftMenu.navbrand.title": "Scouteando",
      "Auth.form.welcome.subtitle": "Scouteando Dashboard",
      "Auth.form.welcome.title": "Welcome!",
    },
    es: {
      "app.components.LeftMenu.navbrand.title": "Scouteando",
      "HomePage.header.title": "Hola {name}",
      "HomePage.header.subtitle": "Siempre Listo!",
      "content-manager.plugin.name": "Gestor de Contenidos",
      "cloud.plugin.name": "Desplegar",
      "Auth.form.welcome.subtitle": "Panel de control de Scouteando",
      "Auth.form.welcome.title": "¡Bienvenido!",
    },
  
  },
};


const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
