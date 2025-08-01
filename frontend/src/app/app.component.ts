import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PreloadService } from './services/preload.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private preloadService: PreloadService) {}

  ngOnInit() {
    console.log('🏠 INICIO: Cargando aplicación Scouteando...');
    
    // Configurar seguimiento de navegación para precarga
    this.preloadService.setupNavigationTracking();
    
    // Precargar contenido inicial
    console.log('📦 PRECARGA: Iniciando precarga de contenido inicial...');
    this.preloadService.preloadInitialContent();
  }
}