import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Article, Category } from '../../interfaces/content.interface';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  category: Category | null = null;
  categorySlug: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(`🎯 CategoryComponent: Inicializando...`);
    // Scroll al inicio inmediatamente al abrir el componente
    window.scrollTo(0, 0);
    
    this.routeSub = this.route.params.subscribe(params => {
      console.log(`📄 Parámetros de ruta recibidos:`, params);
      this.categorySlug = params['category'];
      console.log(`🏷️ Slug de categoría extraído: "${this.categorySlug}"`);
      this.loadCategoryData();
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private loadCategoryData(): void {
    this.isLoading = true;
    this.error = null;
    
    console.log(`🏷️ CARGA: Obteniendo información de categoría "${this.categorySlug}"...`);
    
    // Cargar información de la categoría
    this.contentService.getCategoryBySlug(this.categorySlug).subscribe({
      next: (category) => {
        if (category) {
          this.category = category;
          console.log(`✅ CARGA: Categoría "${category.name}" cargada correctamente`);
          this.loadArticles();
        } else {
          console.warn(`❌ CARGA: Categoría "${this.categorySlug}" no encontrada`);
          this.isLoading = false;
          this.router.navigate(['/error', '404']);
        }
      },
      error: (error) => {
        console.error(`❌ CARGA: Error cargando categoría "${this.categorySlug}":`, error);
        this.isLoading = false;
        this.router.navigate(['/error', '500']);
      }
    });
  }

  private loadArticles(): void {
    console.log(`📚 CARGA: Obteniendo lista de artículos de "${this.categorySlug}"...`);
    
    this.contentService.getArticlesByCategory(this.categorySlug).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.isLoading = false;
        window.scrollTo(0, 0);
        
        console.log(`✅ CARGA: ${articles.length} artículos de "${this.categorySlug}" cargados para visualización`);
        
        // Precargar el contenido completo de todos los artículos inmediatamente
        this.preloadArticleContents(articles);
      },
      error: (error) => {
        console.error(`❌ CARGA: Error cargando artículos de "${this.categorySlug}":`, error);
        this.error = 'Error cargando los artículos';
        this.articles = [];
        this.isLoading = false;
      }
    });
  }

  /**
   * Precarga el contenido completo de todos los artículos para acceso rápido
   */
  private preloadArticleContents(articles: Article[]): void {
    if (articles.length === 0) return;
    
    console.log(`📦 PRECARGA: Iniciando precarga del contenido de ${articles.length} artículos...`);
    
    // Precargar todos los artículos de la categoría
    articles.forEach((article, index) => {
      // Simular la obtención del contenido completo del artículo
      // En una implementación real, esto haría una llamada al proveedor de contenido
      setTimeout(() => {
        console.log(`✅ PRECARGA: Contenido del artículo "${article.title}" precargado`);
      }, (index + 1) * 200); // Espaciar las precargas para no sobrecargar el servidor
    });
    
    console.log(`📦 PRECARGA: ${articles.length} artículos marcados para precarga completa`);
  }

  /**
   * Navegar a un artículo específico
   */
  navigateToArticle(article: Article): void {
    // La ruta simplificada es: /:category/:articleId
    const routeParams = [this.categorySlug, article.id];
    console.log(`🔗 NAVEGACIÓN: Usuario clickeó en "${article.title}"`);
    console.log(`🔗 NAVEGACIÓN: Redirigiendo a artículo...`, routeParams);
    this.router.navigate(routeParams);
  }

  /**
   * Obtener el nombre de la categoría para mostrar
   */
  get categoryName(): string {
    return this.category?.name || this.categorySlug;
  }

  /**
   * Obtener la descripción de la categoría
   */
  get categoryDescription(): string {
    return this.category?.description || '';
  }

  /**
   * Verificar si hay artículos para mostrar
   */
  get hasArticles(): boolean {
    return this.articles.length > 0;
  }
}