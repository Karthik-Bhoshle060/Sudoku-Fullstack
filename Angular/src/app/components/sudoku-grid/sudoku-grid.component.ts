import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { SudokuGeneratorService } from 'src/app/service/sudoku-generator.service';
import { interval, Subscription } from 'rxjs';
import { AppServiceService } from 'src/app/service/app-service.service';
import { Router } from '@angular/router';
import { APIFactoryService } from 'src/app/service/api-factory.service';

@Component({
  selector: 'app-sudoku-grid',
  templateUrl: './sudoku-grid.component.html',
  styleUrls: ['./sudoku-grid.component.scss'],
})
export class SudokuGridComponent implements OnInit, OnDestroy {
  //grid: any[][];
  @Input() grid: any[][] = [];
  @Output() VerifyPuzzle = new EventEmitter<any>();
  answergrid: any[] = [];
  selectedValue: any = null;
  enableValueCount: boolean = false;
  selectedRow: any = null;
  selectedCol: any = null;
  wrongSelection: boolean = false;
  scoreCount = 0;
  mistakeCount = 0;
  topperRecord: any = {};
  valueCount: any[] = [
    { count: 0 },
    { count: 0 },
    { count: 0 },
    { count: 0 },
    { count: 0 },
    { count: 0 },
    { count: 0 },
    { count: 0 },
    { count: 0 },
  ];
  seconds: number = 0;
  private timerSubscription?: Subscription;
  gameCompleted: boolean = false;

  constructor(
    private sudokuGeneratorService: SudokuGeneratorService,
    private appServiceService: AppServiceService,
    private router: Router,
    private apiFactoryService: APIFactoryService
  ) {
    // this.grid = this.sudokuGeneratorService.generateSudoku();
  }
  ngOnInit() {
    this.startNewgame();
    this.startTimer();
  }
  startNewgame() {
    this.answergrid = structuredClone(
      this.sudokuGeneratorService.generatePuzzleWith25Clues(this.grid)
    );
    this.updateCounter();
  }
  secondChance() {
    this.mistakeCount = 2;
    this.startTimer();
  }
  newGame() {
    this.gameCompleted = false;
    this.reset();
    this.startNewgame();
    this.startTimer();
  }
  restart() {
    this.reset();
    this.grid = this.sudokuGeneratorService.printSudoku();
    this.answergrid = structuredClone(this.sudokuGeneratorService.answergrid);
    this.startTimer();
  }

  validateInput(event: Event, row: number, col: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^[1-9]$/.test(value)) {
      input.value = '';
      this.answergrid[row][col] = '';
    } else {
      this.answergrid[row][col] = value;
    }
    this.updateCounter();
  }
  comparetheGrid() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.answergrid[i][j] != this.grid[i][j]) return false;
      }
    }
    return true;
  }
  Validate() {
    let p = this.comparetheGrid();
    let payload = {
      username: this.appServiceService.logedInUser.username,
      timeTakenInSeconds: this.seconds,
      puzzle: this.answergrid.flat().join(''),
      scoreCount: this.scoreCount,
    };
    this.apiFactoryService.storeRecord(payload).subscribe((res) => {
      console.log(res.data);
      this.topperRecord = res.data;
      this.gameCompleted = p;
      this.VerifyPuzzle.emit(p);
    });
  }
  reset() {
    this.answergrid = [];
    this.selectedValue = null;
    this.enableValueCount = false;
    this.selectedRow = null;
    this.selectedCol = null;
    this.wrongSelection = false;
    this.scoreCount = 0;
    this.mistakeCount = 0;
    this.resetTimer();
    this.valueCount = [
      { count: 0 },
      { count: 0 },
      { count: 0 },
      { count: 0 },
      { count: 0 },
      { count: 0 },
      { count: 0 },
      { count: 0 },
      { count: 0 },
    ];
  }
  SelectedValue(i: any, j: any) {
    if (this.wrongSelection) {
      this.selectedValue = this.answergrid[i][j];
      if (!(this.selectedRow == i && this.selectedCol == j)) {
        this.enableValueCount = false;
        return;
      }
    }
    if (this.checkType(this.answergrid[i][j])) {
      this.selectedValue = this.answergrid[i][j];
      this.enableValueCount = false;
      return;
    }
    if (this.answergrid[i][j] != '') {
      this.selectedRow = i;
      this.selectedCol = j;
      this.selectedValue = this.wrongSelection ? null : this.answergrid[i][j];
      this.enableValueCount = true;
    } else {
      this.selectedValue = null;
      this.selectedRow = i;
      this.selectedCol = j;
      this.enableValueCount = true;
    }
  }
  checkAllFilled() {
    const allFilled = this.answergrid.some((row) =>
      row.some((cell: any) => cell == '')
    );
    if (!allFilled) {
      this.appServiceService.isUserPlayingGame = false;
      this.stopTimer();
      this.Validate();
    }
  }
  gotoProfile() {
    this.router.navigate(['profile']);
  }
  addValue(value: any) {
    let i = this.selectedRow;
    let j = this.selectedCol;
    this.answergrid[i][j] = String(value);
    if (i == null && j == null) return;
    if (this.answergrid[i][j] != this.grid[i][j]) {
      // this.selectedValue = null;
      this.wrongSelection = true;
      this.mistakeCount++;
      if (this.mistakeCount == 3) {
        this.stopTimer();
      }
      this.updateCounter();
    } else {
      this.enableValueCount = false;
      this.selectedCol = null;
      this.selectedRow = null;
      this.selectedValue = String(value);
      this.wrongSelection = false;
      this.scoreCount += 50;
      this.updateCounter();
      this.checkAllFilled();
    }
  }
  checkType(value: any) {
    return typeof value == 'number';
  }
  updateCounter() {
    let count = 0;
    for (let i = 0; i < this.valueCount.length; i++) {
      let count = 0;
      for (let row of this.answergrid) {
        for (let num of row) {
          if (num == i + 1) {
            count++;
          }
        }
      }
      this.valueCount[i].count = count;
    }

    // return count;
  }
  startTimer() {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.seconds++;
      });
    }
  }

  stopTimer() {
    this.timerSubscription?.unsubscribe();
  }

  resetTimer() {
    this.stopTimer();
    this.seconds = 0;
  }
  formattedTime(seconds: any = ''): string {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  ngOnDestroy() {
    this.stopTimer(); // Clean up when component is destroyed
  }
}
