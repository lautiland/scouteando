import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PreloadService } from './services/preload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isErrorPage = false;
  
  constructor(
    private preloadService: PreloadService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isErrorPage = event.url.startsWith('/error');
      }
    });
  }

  ngOnInit() {
    console.log('🏠 INICIO: Cargando aplicación Scouteando...');
    
    // Configurar seguimiento de navegación para precarga
    this.preloadService.setupNavigationTracking();
    
    // Precargar contenido inicial
    console.log('📦 PRECARGA: Iniciando precarga de contenido inicial...');
    this.preloadService.preloadInitialContent();
  }
}