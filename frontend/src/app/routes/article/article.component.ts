import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { RouterModule } from '@angular/router';
import { Article } from '../../interfaces/content.interface';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, RouterModule, SkeletonLoaderComponent],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  article: Article | null = null;
  articleId: string = '';
  category: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    // Scroll al inicio inmediatamente al abrir el componente
    window.scrollTo(0, 0);
    
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      this.articleId = params.get('articleId') || '';
      
      console.log('🔗 Navegando a artículo:', { category: this.category, articleId: this.articleId });
      this.loadArticle();
    });
  }

  private loadArticle(): void {
    console.log('📄 Cargando artículo con ID:', this.articleId, 'en categoría:', this.category);
    this.isLoading = true;
    
    this.contentService.getArticlesByCategory(this.category).subscribe({
      next: (articles: Article[]) => {
        console.log('📚 Artículos encontrados:', articles.length);
        this.article = articles.find(article => article.id === this.articleId) || null;
        this.isLoading = false;
        
        if (this.article) {
          console.log('✅ Artículo encontrado:', this.article.title);
        } else {
          console.log('❌ Artículo no encontrado con ID:', this.articleId);
          this.router.navigate(['/error', '404']);
        }
      },
      error: (error) => {
        console.error('❌ Error cargando artículos:', error);
        this.router.navigate(['/error', '500']);
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Animación suave
    });
  }
}