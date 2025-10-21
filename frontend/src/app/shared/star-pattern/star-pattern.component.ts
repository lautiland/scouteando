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

    ::ng-deep .star-pattern-1 {
      background-image: 
        radial-gradient(white 1.2px, transparent 1.2px),
        radial-gradient(white 0.9px, transparent 0.9px),
        radial-gradient(white 0.6px, transparent 0.6px);
      background-size: 100px 100px, 80px 80px, 60px 60px;
      background-position: 0 0, 40px 40px, 20px 20px;
      animation: rotate-1 600s linear infinite;
      opacity: 0.3;
      opacity: 0.4;
    }

    ::ng-deep .star-pattern-2 {
      background-image: 
        radial-gradient(white 0.4px, transparent 0.4px),
        radial-gradient(white 0.2px, transparent 0.2px),
        radial-gradient(white 0.3px, transparent 0.3px);
      background-size: 50px 50px, 35px 35px, 40px 40px;
      background-position: 25px 25px, 10px 10px, 30px 30px;
      animation: rotate-2 500s linear infinite reverse;
      opacity: 0.3;
      transform: rotate(45deg) translateZ(2px);
    }

    ::ng-deep .star-pattern-3 {
      background-image: 
        radial-gradient(white 0.8px, transparent 0.8px),
        radial-gradient(white 0.6px, transparent 0.6px),
        radial-gradient(white 0.4px, transparent 0.4px);
      background-size: 90px 90px, 70px 70px, 50px 50px;
      background-position: 15px 15px, 40px 40px, 25px 25px;
      animation: rotate-3 550s linear infinite;
      opacity: 0.35;
      transform: rotate(-60deg) translateZ(-1px);
    }

    ::ng-deep .star-pattern-4 {
      background-image: 
        radial-gradient(white 0.3px, transparent 0.3px),
        radial-gradient(white 0.15px, transparent 0.15px),
        radial-gradient(white 0.25px, transparent 0.25px);
      background-size: 45px 45px, 30px 30px, 40px 40px;
      background-position: 20px 20px, 5px 5px, 15px 15px;
      animation: rotate-2 450s linear infinite reverse;
      opacity: 0.25;
      transform: rotate(30deg) translateZ(1px);
    }

    ::ng-deep .star-pattern-5 {
      background-image: 
        radial-gradient(white 1px, transparent 1px),
        radial-gradient(white 0.7px, transparent 0.7px),
        radial-gradient(white 0.5px, transparent 0.5px);
      background-size: 120px 120px, 95px 95px, 75px 75px;
      background-position: 30px 30px, 15px 15px, 45px 45px;
      animation: rotate-1 650s linear infinite;
      opacity: 0.3;
      transform: rotate(-30deg) translateZ(-2px);
    }

    ::ng-deep .star-pattern-6 {
      background-image: 
        radial-gradient(white 0.5px, transparent 0.5px),
        radial-gradient(white 0.35px, transparent 0.35px),
        radial-gradient(white 0.2px, transparent 0.2px);
      background-size: 55px 55px, 40px 40px, 35px 35px;
      background-position: 20px 20px, 35px 35px, 10px 10px;
      animation: rotate-3 700s linear infinite reverse;
      opacity: 0.35;
      transform: rotate(75deg) translateZ(3px);
    }

    @keyframes twinkle-1 {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.2; }
    }

    @keyframes twinkle-2 {
      0%, 100% { opacity: 0.3; }
      33% { opacity: 0.15; }
      66% { opacity: 0.25; }
    }

    @keyframes twinkle-3 {
      0%, 100% { opacity: 0.35; }
      25% { opacity: 0.2; }
      75% { opacity: 0.3; }
    }

    @keyframes twinkle-4 {
      0%, 100% { opacity: 0.25; }
      40% { opacity: 0.1; }
      80% { opacity: 0.2; }
    }

    @keyframes twinkle-5 {
      0%, 100% { opacity: 0.3; }
      45% { opacity: 0.15; }
      70% { opacity: 0.25; }
    }

    @keyframes twinkle-6 {
      0%, 100% { opacity: 0.35; }
      30% { opacity: 0.2; }
      60% { opacity: 0.3; }
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