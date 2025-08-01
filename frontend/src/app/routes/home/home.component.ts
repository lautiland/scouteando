import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor() {}

  ngOnInit() {
    console.log('🏠 CARGA: Pantalla principal cargada correctamente');
  }
}