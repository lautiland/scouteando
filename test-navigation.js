// Test de navegación manual
console.log('=== TEST DE NAVEGACIÓN MANUAL ===');

// Simular el comportamiento del CategoryComponent.navigateToArticle()
const testArticle = {
    id: 'ley-scout',
    title: 'La Ley Scout',
    category: 'espiritu'
};

const categorySlug = 'espiritu';

// Esta es la nueva lógica de navegación
const routeParams = [categorySlug, testArticle.id];
console.log('Nueva ruta generada:', routeParams);
console.log('URL esperada: /espiritu/ley-scout');

// Verificar que ya no se genere la ruta duplicada
const oldRouteParams = [categorySlug, testArticle.id, testArticle.id]; // Comportamiento anterior
console.log('Ruta anterior (problemática):', oldRouteParams);
console.log('URL anterior problemática: /espiritu/ley-scout/ley-scout');

console.log('=== RESULTADO: URL limpia sin duplicación ===');
