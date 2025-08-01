import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { RouterModule } from '@angular/router';
import { Article } from '../../interfaces/content.interface';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, RouterModule], // Importaciones necesarias
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  article: Article | null = null;
  fileId: string = '';
  category: string = '';

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      // El fileId en nuestra implementación es realmente el slug del artículo
      const articleSlug = params.get('fileId') || '';
      this.fileId = articleSlug;
      
      console.log('🔗 Navegando a artículo:', { category: this.category, slug: articleSlug });
      this.loadArticle();
    });
  }

  private loadArticle(): void {
    console.log('📄 Cargando artículo con slug:', this.fileId, 'en categoría:', this.category);
    
    // En el sistema actual, el fileId es realmente el slug del artículo
    this.contentService.getArticlesByCategory(this.category).subscribe({
      next: (articles: Article[]) => {
        console.log('📚 Artículos encontrados:', articles.length);
        this.article = articles.find(article => article.slug === this.fileId) || null;
        
        if (this.article) {
          console.log('✅ Artículo encontrado:', this.article.title);
        } else {
          console.log('❌ Artículo no encontrado con slug:', this.fileId);
          this.article = {
            id: 'not-found',
            title: 'Artículo no encontrado',
            slug: 'not-found',
            content: 'El contenido del artículo no está disponible.',
            excerpt: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            category: this.category,
            author: 'Autor desconocido'
          };
        }
      },
      error: (error) => {
        console.error('❌ Error cargando artículos:', error);
        this.article = {
          id: 'error',
          title: 'Error al cargar artículo',
          slug: 'error',
          content: 'Hubo un problema al cargar el artículo.',
          excerpt: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: this.category,
          author: 'Autor desconocido'
        };
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