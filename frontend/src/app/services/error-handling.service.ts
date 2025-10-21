import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private router: Router) {}

  /**
   * Maneja errores HTTP y redirige a la página de error correspondiente
   */
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 404:
          this.router.navigate(['/error', '404']);
          break;
        case 403:
          this.router.navigate(['/error', '403']);
          break;
        case 500:
          this.router.navigate(['/error', '500']);
          break;
        default:
          // Para otros errores HTTP, redirigimos a error genérico
          this.router.navigate(['/error', error.status.toString()]);
      }
    } else {
      // Para errores no HTTP, redirigimos a error 500
      this.router.navigate(['/error', '500']);
    }
  }

  /**
   * Maneja errores de navegación
   */
  handleNavigationError(error: Error): void {
    console.error('Error de navegación:', error);
    this.router.navigate(['/error', '404']);
  }

  /**
   * Maneja errores de autorización
   */
  handleAuthError(): void {
    this.router.navigate(['/error', '403']);
  }
}