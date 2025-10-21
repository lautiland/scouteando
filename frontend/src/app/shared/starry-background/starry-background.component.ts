import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarPatternComponent } from '../star-pattern/star-pattern.component';

@Component({
  selector: 'app-starry-background',
  standalone: true,
  imports: [CommonModule, StarPatternComponent],
  template: `
    <div class="stars-container" [style.background-color]="backgroundColor">
      <app-star-pattern>
        <div class="star-layer star-pattern-1"></div>
        <div class="star-layer star-pattern-2"></div>
        <div class="star-layer star-pattern-3"></div>
        <div class="star-layer star-pattern-4"></div>
        <div class="star-layer star-pattern-5"></div>
        <div class="star-layer star-pattern-6"></div>
      </app-star-pattern>
    </div>
  `,
  styles: [`
    .stars-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
      perspective: 1000px;
    }
  `]
})
export class StarryBackgroundComponent {
  @Input() backgroundColor: string = 'black';
}
