import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ContentProvider, Article, Category, ProviderType } from '../interfaces/content.interface';
import { MarkdownProvider } from './providers/markdown.provider';
import { StrapiProvider } from './providers/strapi.provider';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private currentProvider!: ContentProvider;
  private readonly cache = new Map<string, { data: any, expires: number }>();
  private readonly CACHE_TTL = 300000; // 5 minutos

  constructor(
    private markdownProvider: MarkdownProvider,
    private strapiProvider: StrapiProvider
  ) {
    console.log(`🔧 ContentService: Inicializando con provider "${environment.content?.provider || 'markdown'}"`);
    this.setProvider(environment.content?.provider || 'markdown');
  }

  setProvider(providerType: ProviderType): void {
    console.log(`🔄 ContentService: Cambiando a provider "${providerType}"`);
    switch (providerType) {
      case 'markdown':
        this.currentProvider = this.markdownProvider;
        console.log(`📝 ContentService: Usando MarkdownProvider`);
        break;
      case 'strapi':
        this.currentProvider = this.strapiProvider;
        console.log(`🎯 ContentService: Usando StrapiProvider`);
        break;
      default:
        console.warn(`⚠️ ContentService: Provider "${providerType}" no reconocido, usando MarkdownProvider`);
        this.currentProvider = this.markdownProvider;
    }
  }

  private async getCached<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && cached.expires > now) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, expires: now + this.CACHE_TTL });
    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getArticles(): Observable<Article[]> {
    // Como no tenemos getArticles en la interfaz, obtenemos artículos de todas las categorías
    const cacheKey = 'all-articles';
    
    return from(this.getCached(cacheKey, async () => {
      const categories = await this.currentProvider.getCategories();
      const allArticles: Article[] = [];
      
      for (const category of categories) {
        const articles = await this.currentProvider.getArticlesByCategory(category.slug);
        allArticles.push(...articles);
      }
      
      return allArticles;
    }));
  }

  getArticlesByCategory(categorySlug: string): Observable<Article[]> {
    const cacheKey = `articles-${categorySlug}`;
    
    return from(this.getCached(cacheKey, () => 
      this.currentProvider.getArticlesByCategory(categorySlug)
    ));
  }

  getArticleById(id: string): Observable<Article | null> {
    const cacheKey = `article-${id}`;
    
    return from(this.getCached(cacheKey, () => 
      this.currentProvider.getArticleById(id)
    ));
  }

  getCategories(): Observable<Category[]> {
    const cacheKey = 'categories';
    
    return from(this.getCached(cacheKey, () => 
      this.currentProvider.getCategories()
    ));
  }

  getCategoryBySlug(slug: string): Observable<Category | null> {
    const cacheKey = `category-${slug}`;
    console.log(`🎯 ContentService: Buscando categoría "${slug}" (provider actual: ${this.currentProvider.constructor.name})`);
    
    return from(this.getCached(cacheKey, () => 
      this.currentProvider.getCategoryBySlug(slug)
    ));
  }

  preloadArticlesByCategory(categorySlug: string): void {
    this.getArticlesByCategory(categorySlug).subscribe({
      next: (articles) => {
        console.log(`✅ PRECARGA: ${articles.length} artículos de "${categorySlug}" precargados correctamente`);
      },
      error: (error) => {
        console.error(`❌ ERROR PRECARGA: Falló precarga de artículos para "${categorySlug}":`, error);
      }
    });
  }
}
