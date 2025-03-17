import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriveService } from '../../services/drive.service';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, RouterModule], // Importaciones necesarias
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  article: any;
  fileId: string = '';
  category: string = '';

  constructor(
    private route: ActivatedRoute,
    private driveService: DriveService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const fileId = params.get('fileId') || '';
      this.category = params.get('category') || '';
      this.fileId = fileId;
      this.loadArticle();
    });
  }

  private loadArticle(): void {
    this.driveService.getArticleContent(this.fileId).subscribe({
      next: (article) => {
        this.article = article;
      },
      error: () => {
        this.article = {
          nombre: 'Artículo no encontrado',
          contenidoHTML: 'El contenido del artículo no está disponible.',
          ultimoUsuario: 'Autor desconocido',
          ultimaModificacion: 'Fecha desconocida'
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