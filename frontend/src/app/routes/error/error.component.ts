import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarryBackgroundComponent } from '../../shared/starry-background/starry-background.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, StarryBackgroundComponent],
  template: `
    <div class="error-container">
      <app-starry-background [backgroundColor]="'#00051e'"></app-starry-background>
      <div class="error-content">
        <h1>404</h1>
        <p>¡Lo sentimos! No encontramos la página que buscas.</p>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      overflow: hidden;
    }

    .error-content {
      position: relative;
      z-index: 1;
      text-align: center;
    }

    h1 {
      font-size: 6rem;
      margin: 0;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    p {
      font-size: 1.5rem;
      margin: 1rem 0;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
  `]
})
export class ErrorComponent {}