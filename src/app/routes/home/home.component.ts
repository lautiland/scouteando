import { Component } from '@angular/core';
import { DriveService } from '../../services/drive.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private driveService: DriveService) {}

  ngOnInit() {
    this.driveService.preloadAllCategories();
  }
}