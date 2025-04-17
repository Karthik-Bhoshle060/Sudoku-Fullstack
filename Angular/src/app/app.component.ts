import { Component, OnInit } from '@angular/core';
import { SudokuGeneratorService } from './service/sudoku-generator.service';
import { LoaderService } from './service/loader-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoading = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService) {}
}
