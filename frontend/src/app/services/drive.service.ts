// Archivo temporal para reemplazar DriveService mientras migramos
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DriveService {
  constructor() {
    console.warn('⚠️ DriveService está deprecated. Usar ContentService en su lugar.');
  }

  // Métodos legacy para compatibilidad temporal
  getFilesByCategory(categoryId: string): Observable<any[]> {
    console.warn('⚠️ getFilesByCategory deprecated. Usar ContentService.getArticlesByCategory()');
    return of([]);
  }

  preloadCategory(categoryId: string): void {
    console.warn('⚠️ preloadCategory deprecated. Usar PreloadService.preloadCategoryArticles()');
  }

  preloadArticlesInCategory(category: string): void {
    console.warn('⚠️ preloadArticlesInCategory deprecated. Usar PreloadService.preloadCategoryArticles()');
  }

  // Otros métodos que puedan existir...
  getFileContent(): Observable<any> {
    return of(null);
  }

  preloadAllCategories(): void {
    console.warn('⚠️ preloadAllCategories deprecated. Usar PreloadService.preloadAllCategories()');
  }
}
