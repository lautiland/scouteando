export const environment = {
  production: false,
  content: {
    provider: 'strapi' as const, // 'markdown' | 'strapi' | 'drive' - Cambiando a Strapi
    markdownPath: '/assets/content',
    strapiUrl: 'http://localhost:1337' // URL del backend Strapi
  },
  // Configuración legacy de Drive (se mantendrá hasta migrar completamente)
  drive: {
    apiKey: "dummyKey",
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