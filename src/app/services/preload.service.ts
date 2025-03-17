import { Injectable } from '@angular/core';
import { DriveService } from './drive.service';
import { environment } from '../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PreloadService {
  constructor(
    private driveService: DriveService,
    private router: Router
  ) {}

  preloadAllCategories(): void {
    Object.values(environment.drive.folders.categorias).forEach(categoria => {
      this.driveService.preloadCategory(categoria.id);
    });
  }

  setupNavigationTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      pairwise()
    )
  }
}