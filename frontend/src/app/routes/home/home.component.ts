import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Category } from '../../interfaces/content.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    console.log('🏠 CARGA: Pantalla principal cargada correctamente');
    // Scroll al inicio inmediatamente al abrir el componente
    window.scrollTo(0, 0);
    this.loadCategories();
  }

  private loadCategories() {
    this.contentService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
        console.log('📂 CATEGORÍAS: Cargadas correctamente:', categories.length);
      },
      error: (error) => {
        console.error('❌ ERROR: Error cargando categorías:', error);
        this.isLoading = false;
      }
    });
  }
}