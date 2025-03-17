import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriveService } from '../../services/drive.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importaciones correctas
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
  articles: any[] = [];
  categoryName: string = '';
  currentCategory: string = '';
  private routeSub!: Subscription;

  constructor(
    public route: ActivatedRoute,
    private driveService: DriveService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.currentCategory = params['category'];
      this.loadCategoryData();
      this.driveService.preloadArticlesInCategory(this.currentCategory);
    });
  }

  private loadCategoryData(): void {
    const categoria = environment.drive.folders.categorias[this.currentCategory as keyof typeof environment.drive.folders.categorias];
    
    if (categoria) {
      this.categoryName = categoria.nombre;
      this.driveService.getFilesByCategory(categoria.id).subscribe({
        next: (files) => {
          this.articles = files;
          window.scrollTo(0, 0);
        },
        error: () => this.articles = []
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  public getRouteLink(fileName: string, fileId: string): Array<string> {
    return [`/${this.currentCategory}/${this.slugify(fileName)}/${fileId}`];
  }

  private slugify(text: string): string {
    return text.toString().toLowerCase()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}