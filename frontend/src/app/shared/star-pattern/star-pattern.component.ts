import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-pattern',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: block;
      pointer-events: none;
    }

    ::ng-deep .star-layer {
      position: absolute;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      transform-origin: center center;
      will-change: transform, opacity;
      backface-visibility: hidden;
      perspective: 1000;
      -webkit-backface-visibility: hidden;
      -webkit-perspective: 1000;
      pointer-events: none;
    }

    ::ng-deep .star-pattern-1, 
    ::ng-deep .star-pattern-2,
    ::ng-deep .star-pattern-3,
    ::ng-deep .star-pattern-4,
    ::ng-deep .star-pattern-5,
    ::ng-deep .star-pattern-6 {
      background-image: radial-gradient(white var(--s1, 1.2px), transparent var(--s1, 1.2px)),
                      radial-gradient(white var(--s2, 0.9px), transparent var(--s2, 0.9px)),
                      radial-gradient(white var(--s3, 0.6px), transparent var(--s3, 0.6px));
      opacity: var(--o, 0.3);
    }

    ::ng-deep .star-pattern-1 {
      --s1: 1.2px;
      --s2: 0.9px;
      --s3: 0.6px;
      --o: 0.4;
      background-size: 100px 100px, 80px 80px, 60px 60px;
      background-position: 0 0, 40px 40px, 20px 20px;
      animation: rotate-1 600s linear infinite;
    }

    ::ng-deep .star-pattern-2 {
      --s1: 0.4px;
      --s2: 0.2px;
      --s3: 0.3px;
      --o: 0.3;
      background-size: 50px 50px, 35px 35px, 40px 40px;
      background-position: 25px 25px, 10px 10px, 30px 30px;
      animation: rotate-2 500s linear infinite reverse;
      transform: rotate(45deg) translateZ(2px);
    }

    ::ng-deep .star-pattern-3 {
      --s1: 0.8px;
      --s2: 0.6px;
      --s3: 0.4px;
      --o: 0.35;
      background-size: 90px 90px, 70px 70px, 50px 50px;
      background-position: 15px 15px, 40px 40px, 25px 25px;
      animation: rotate-3 550s linear infinite;
      transform: rotate(-60deg) translateZ(-1px);
    }

    ::ng-deep .star-pattern-4 {
      --s1: 0.3px;
      --s2: 0.15px;
      --s3: 0.25px;
      --o: 0.25;
      background-size: 45px 45px, 30px 30px, 40px 40px;
      background-position: 20px 20px, 5px 5px, 15px 15px;
      animation: rotate-2 450s linear infinite reverse;
      transform: rotate(30deg) translateZ(1px);
    }

    ::ng-deep .star-pattern-5 {
      --s1: 1px;
      --s2: 0.7px;
      --s3: 0.5px;
      --o: 0.3;
      background-size: 120px 120px, 95px 95px, 75px 75px;
      background-position: 30px 30px, 15px 15px, 45px 45px;
      animation: rotate-1 650s linear infinite;
      transform: rotate(-30deg) translateZ(-2px);
    }

    ::ng-deep .star-pattern-6 {
      --s1: 0.5px;
      --s2: 0.35px;
      --s3: 0.2px;
      --o: 0.35;
      background-size: 55px 55px, 40px 40px, 35px 35px;
      background-position: 20px 20px, 35px 35px, 10px 10px;
      animation: rotate-3 700s linear infinite reverse;
      transform: rotate(75deg) translateZ(3px);
    }

    @keyframes twinkle {
      0%, 100% { opacity: var(--o); }
      50% { opacity: calc(var(--o) * 0.5); }
    }

    @keyframes rotate-1 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes rotate-2 {
      from { transform: rotate(45deg) translateZ(2px); }
      to { transform: rotate(405deg) translateZ(2px); }
    }

    @keyframes rotate-3 {
      from { transform: rotate(-60deg) translateZ(-1px); }
      to { transform: rotate(300deg) translateZ(-1px); }
    }
  `]
})
export class                                                                                                                                                                                                                                                                                                                                                                                                                                                                            StarPatternComponent {}