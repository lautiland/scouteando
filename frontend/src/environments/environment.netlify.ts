export const environment = {
  production: true,
  content: {
    provider: 'markdown' as const, // Para Netlify usar markdown
    markdownPath: '/assets/content', // Ruta específica para Netlify
    strapiUrl: 'https://tudominio.com/api' // URL del backend en producción (futuro)
  },
  // Configuración legacy de Drive (se mantendrá hasta migrar completamente)
  drive: {
    apiKey: "DRIVE_API_KEY",
    folders: {
      categorias: {
        espiritu: {id: '1sPgcK4Z3ClI-OX0Us0vnuMMz_goLCM3x', nombre: 'Espíritu'},
        historia: {id: '1eiJyhfhChIiKpIShcAxi_u5wrm4_KNBh', nombre: 'Historia'},
        organizacion: {id: '1lSRTsE2x834lI4OwUQH7be5f3l6R7e68', nombre: 'Organización'},
        tecnica: {id: '1yij4Rgb0c8n_unAPP-6TSeOdKs4Igikq', nombre: 'Técnica'}
      }
    }
  }
}
