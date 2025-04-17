import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { SudokuGeneratorService } from 'src/app/service/sudoku-generator.service';

@Component({
  selector: 'app-sudoku-solver',
  templateUrl: './sudoku-solver.component.html',
  styleUrls: ['./sudoku-solver.component.scss'],
})
export class SudokuSolverComponent implements OnInit {
  sudokugrid: any;
  startSudokuGame: boolean = false;
  gameCompleted: boolean = false;
  constructor(
    private sudokuGeneratorService: SudokuGeneratorService,
    public appServiceService: AppServiceService
  ) {}
  ngOnInit() {
    if (this.appServiceService.isRulesShowedtoUser) {
      this.newGame();
    }
    this.generatenewSudoku();
  }
  generatenewSudoku() {
    this.sudokugrid = this.sudokuGeneratorService.generateSudoku();
  }
  printOutput(result: any) {
    this.gameCompleted = result;
  }
  startGame() {
    this.startSudokuGame = true;
    this.appServiceService.isRulesShowedtoUser = true;
    this.appServiceService.isUserPlayingGame = true;
  }
  newGame() {
    this.startSudokuGame = true;
    this.appServiceService.isUserPlayingGame = true;
  }
}
