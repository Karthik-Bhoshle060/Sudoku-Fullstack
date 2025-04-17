import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SudokuGeneratorService {
  public grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  public answergrid: any[] = [];

  constructor() {}
  isSafe(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i] === num || this.grid[i][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  solve(row = 0, col = 0): boolean {
    if (row === 9) return true;
    if (col === 9) return this.solve(row + 1, 0);
    if (this.grid[row][col] !== 0) return this.solve(row, col + 1);

    let numbers = Array.from({ length: 9 }, (_, i) => i + 1).sort(
      () => Math.random() - 0.5
    );

    for (let num of numbers) {
      if (this.isSafe(row, col, num)) {
        this.grid[row][col] = num;
        if (this.solve(row, col + 1)) return true;
        this.grid[row][col] = 0;
      }
    }
    return false;
  } // Function to check if a number can be placed in a cell
  isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  }
  printSudoku() {
    let newgrid = this.grid;
    newgrid.forEach((row) => console.log(row.join('')));
    console.log(newgrid);
    return newgrid;
  }
  generateSudoku() {
    this.grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.solve();

    return this.printSudoku();
  }
  // Count solutions for a given board state
  countSolutions(board: number[][]): number {
    let solutionCount = 0;

    const backtrack = (row: number, col: number): void => {
      if (row === 9) {
        solutionCount += 1;
        return;
      }
      const nextRow = col === 8 ? row + 1 : row;
      const nextCol = (col + 1) % 9;

      if (board[row][col] !== 0) {
        backtrack(nextRow, nextCol);
      } else {
        for (let num = 1; num <= 9; num++) {
          if (this.isValid(board, row, col, num)) {
            board[row][col] = num;
            backtrack(nextRow, nextCol);
            board[row][col] = 0;
          }
        }
      }
    };

    backtrack(0, 0);
    return solutionCount;
  }
  generatePuzzleWith25Clues(grid: any): any[][] {
    const board = grid.map((row: any) => [...row]);
    // Count how many clues are currently present
    let clues = 81; // Start with a completely filled grid

    // Keep removing clues until only 25 remain
    while (clues > 25) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (board[row][col] !== 0) {
        // Only try removing if the cell is not already empty
        const backup = board[row][col]; // Store the number before removing
        board[row][col] = ''; // Remove the number

        // Check if the puzzle still has **only one unique solution**
        if (this.countSolutions(board) !== 1) {
          board[row][col] = backup; // Restore the number if multiple solutions exist
        } else {
          clues--; // Successfully removed one clue
        }
      }
    }
    this.answergrid = board;
    return board; // Return the board with exactly 25 clues
  }
}
