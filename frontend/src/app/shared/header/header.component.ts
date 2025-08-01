import { Component} from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface Categorias {
  [key: string]: string; 
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgForOf, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public categorias = environment.drive.folders.categorias;

  get categoriasLista() {
    return Object.entries(this.categorias).map(([key, value]) => ({
      clave: key,
      nombre: (value as Categoria).nombre // Type assertion
    }));
  }

  
  cerrarMenu(): void {
    const menuHamb = document.getElementById("menu_hamb");
    if (menuHamb) {
      menuHamb.click();
    }
  }
}

interface Categoria {
  id: string;
  nombre: string;
}