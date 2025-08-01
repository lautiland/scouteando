import { Injectable } from '@angular/core';
import { ContentService } from './content.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PreloadService {
  constructor(
    private contentService: ContentService,
    private router: Router
  ) {}

  /**
   * Precarga artículos de todas las categorías
   */
  preloadAllCategories(): void {
    this.contentService.getCategories().subscribe({
      next: (categories) => {
        categories.forEach(category => {
          this.contentService.preloadArticlesByCategory(category.slug);
        });
      },
      error: (error) => {
        console.error('Error precargando categorías:', error);
      }
    });
  }

  /**
   * Precarga artículos de una categoría específica
   */
  preloadCategoryArticles(categorySlug: string): void {
    console.log(`📦 PRECARGA: Precargando artículos de "${categorySlug}"...`);
    this.contentService.preloadArticlesByCategory(categorySlug);
  }

  /**
   * Configura el seguimiento de navegación para precargar contenido
   */
  setupNavigationTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      pairwise()
    ).subscribe(([previousEvent, currentEvent]) => {
      const currentUrl = (currentEvent as NavigationEnd).url;
      
      // Si navega a una categoría, precargar sus artículos
      const categoryMatch = currentUrl.match(/\/([^\/]+)$/);
      if (categoryMatch && !currentUrl.includes('/article/')) {
        const categorySlug = categoryMatch[1];
        console.log(`🔗 NAVEGACIÓN: Detectada navegación a categoría "${categorySlug}"`);
        console.log(`� PRECARGA: Iniciando precarga de artículos...`);
        this.preloadCategoryArticles(categorySlug);
      }
    });
  }

  /**
   * Precarga contenido inicial de la aplicación
   */
  preloadInitialContent(): void {
    console.log('📦 PRECARGA: Obteniendo lista de categorías...');
    
    // Precargar categorías
    this.contentService.getCategories().subscribe({
      next: (categories) => {
        console.log(`✅ PRECARGA: ${categories.length} categorías disponibles`);
        
        // Precargar artículos de la primera categoría (más probable de ser visitada)
        if (categories.length > 0) {
          const firstCategory = categories[0];
          console.log(`📦 PRECARGA: Iniciando precarga de categoría principal "${firstCategory.name}"...`);
          this.preloadCategoryArticles(firstCategory.slug);
        }
      },
      error: (error) => {
        console.warn('❌ PRECARGA: Error obteniendo categorías:', error);
      }
    });
  }

  /**
   * Limpia la caché de contenido
   */
  clearContentCache(): void {
    this.contentService.clearCache();
  }
}