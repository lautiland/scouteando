import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.css'
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'article' | 'list' = 'card';
  @Input() count: number = 3;
  @Input() hasImage: boolean = true;
  @Input() animated: boolean = true;
  @Input() height: string = '';
  @Input() width: string = '';

  get skeletonArray(): number[] {
    return Array(this.count).fill(0);
  }

  trackByIndex(index: number): number {
    return index;
  }

  getClasses(): string[] {
    const classes = ['skeleton'];
    if (this.animated) classes.push('skeleton-animate');
    if (this.type) classes.push(`skeleton-${this.type}`);
    return classes;
  }

  getStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    if (this.height) styles['height'] = this.height;
    if (this.width) styles['width'] = this.width;
    return styles;
  }
}
