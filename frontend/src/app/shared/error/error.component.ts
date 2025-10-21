import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StarryBackgroundComponent } from '../starry-background/starry-background.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule, StarryBackgroundComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  errorCode: string = '404';
  errorTitle: string = '';
  errorMessage: string = '';
  errorImage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el código de error de la ruta o de los datos de la ruta
    this.route.params.subscribe(params => {
      this.route.data.subscribe(data => {
        this.errorCode = params['code'] || data['code'] || '404';
        this.setupErrorData();
      });
    });
  }

  private setupErrorData() {
    switch (this.errorCode) {
      case '404':
        this.errorTitle = '¡Te saliste del camino!';
        this.errorMessage = 'Parece que el sendero que buscás no existe o lo movieron a otro lado.';
        this.errorImage = '/assets/images/pistafin.svg';
        break;
      
      case '500':
        this.errorTitle = '¡El fogón se apagó!';
        this.errorMessage = 'Scouteando está caído. Nuestros scouts están trabajando para solucionarlo.';
        this.errorImage = '/assets/images/pistacampa.svg';
        break;
      
      default:
        this.errorTitle = '¡Media vuelta, mismo camino!';
        this.errorMessage = 'Nos encontramos con una situación que no esperábamos.';
        this.errorImage = '/assets/images/pistavolver.svg';
        break;
    }
  }

  goHome() {
    window.location.href = '/';
  }

  goBack() {
    window.history.back();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
