import _ from 'lodash';
import {Coord} from '../../shared/types';
import Direction from '../../util/Direction';
import {areCoordsEqual} from '../../util/util';
import {WsCheckEvent} from '../Events/WsCheckEvent';
import {WsEvent} from '../Events/WsEvent';
import {WsGridEntry} from '../Events/WsGridEntry';
import {WsRevealEvent} from '../Events/WsRevealEvent';
import {WsUpdateCellEvent} from '../Events/WsUpdateCellEvent';
import GridEntry, {CheckState} from './GridEntry';

class PuzzleModel {
  grid: GridEntry[][];
  solution: string[][];

  constructor(grid: GridEntry[][], solution: string[][]) {
    this.grid = _.cloneDeep(grid);
    this.solution = _.cloneDeep(solution);
  }

  updateForEvent(event: WsEvent) {
    if (event.type === 'updateCell') {
      this.onUpdateCellEvent(event as WsUpdateCellEvent);
    } else if (event.type === 'check') {
      this.onCheckEvent(event as WsCheckEvent);
    } else if (event.type === 'reveal') {
      this.onRevealEvent(event as WsRevealEvent);
    }
  }

  private onRevealEvent(event: WsRevealEvent) {
    const {scope} = event.params;
    for (const cell of scope) {
      this.revealCell(cell);
    }
  }

  private onCheckEvent(event: WsCheckEvent) {
    const {scope} = event.params;
    for (const cell of scope) {
      this.checkCell(cell);
    }
  }

  private onUpdateCellEvent(event: WsUpdateCellEvent) {
    const {cell, value, color, pencil} = event.params;
    const gridEntry = this.getGridEntry(cell);
    if (gridEntry.isEditable()) {
      this.getGridEntry(cell).update({value, color, pencil});
    }
  }

  private revealCell(cell: Coord) {
    const entry = this.getGridEntry(cell);
    const correctValue = this.getSolution(cell);
    entry.update({
      value: correctValue,
      checkState: CheckState.REVEALED,
    });
  }

  private checkCell(cell: Coord) {
    const entry = this.getGridEntry(cell);
    const correctValue = this.getSolution(cell);
    entry.update({
      checkState:
        entry.state.value === correctValue
          ? CheckState.CORRECT
          : CheckState.INCORRECT,
    });
  }

  getSolution(cell: Coord): string {
    return this.solution[cell.r][cell.c];
  }

  getGridEntry(cell: Coord): GridEntry {
    return this.grid[cell.r][cell.c];
  }

  private getRow(row: number): GridEntry[] {
    return [...this.grid[row]];
  }

  private getCol(col: number): GridEntry[] {
    return this.grid.map(row => row[col]);
  }

  getWordScopedCellsUnsorted(
    selectedIndex: number,
    cells: GridEntry[],
  ): GridEntry[] {
    if (cells.length === 0) {
      return [];
    }
    const scopedCells = [cells[selectedIndex]];
    let i = selectedIndex - 1;
    // Cells before
    while (i >= 0 && !cells[i].state.black) {
      scopedCells.push(cells[i]);
      i--;
    }
    // Cells after
    let j = selectedIndex + 1;
    while (j < cells.length && !cells[j].state.black) {
      scopedCells.push(cells[j]);
      j++;
    }
    return scopedCells;
  }

  getWordScopedRow(selectedCell: Coord): GridEntry[] {
    const row = this.getRow(selectedCell.r);
    const scopedCells = this.getWordScopedCellsUnsorted(selectedCell.c, row);
    scopedCells.sort((e1, e2) => e1.state.cell.c - e2.state.cell.c);
    return scopedCells;
  }

  getWordScopedCol(selectedCell: Coord): GridEntry[] {
    const col = this.getCol(selectedCell.c);
    const scopedCells = this.getWordScopedCellsUnsorted(selectedCell.r, col);
    scopedCells.sort((e1, e2) => e1.state.cell.r - e2.state.cell.r);
    return scopedCells;
  }

  getWordScopedCells(selectedCell: Coord, direction: Direction): GridEntry[] {
    if (this.grid.length === 0 || this.grid[0].length === 0) {
      // Empty grid, return
      return [];
    }
    switch (direction) {
      case Direction.DOWN:
        return this.getWordScopedCol(selectedCell);
      case Direction.ACROSS:
        return this.getWordScopedRow(selectedCell);
    }
  }

  getClueIndex(cell: Coord, direction: Direction): number | null {
    if (this.grid.length === 0 || this.grid[0].length === 0) {
      // Empty grid, return
      return null;
    }
    const scopedCells = this.getWordScopedCells(cell, direction);
    return scopedCells[0].state.number;
  }

  updateCellValue(cell: Coord, value: string, pencil: boolean) {
    const entry = this.getGridEntry(cell);
    if (entry.isEditable()) {
      entry.update({value, pencil});
    }
  }

  /** Given the current cell and direction, find the next one to select */
  getNextCell(cell: Coord, dir: Direction, invert: boolean = false): Coord {
    const cells = this.getWordScopedCells(cell, dir);
    if (cells.length === 0) {
      return cell;
    }
    const cellIndex = cells.findIndex(entry =>
      areCoordsEqual(entry.state.cell, cell),
    );
    const nextCellIndex = cellIndex + (invert ? -1 : 1);
    if (nextCellIndex >= 0 && nextCellIndex < cells.length) {
      return cells[nextCellIndex].state.cell;
    }
    return cell;
  }

  getWhiteCells(): GridEntry[] {
    return this.grid.flat().filter(gridEntry => !gridEntry.state.black);
  }

  static fromWsGrid(
    wsGrid: WsGridEntry[][],
    solution: string[][],
  ): PuzzleModel {
    return new PuzzleModel(
      wsGrid.map((rows, r) =>
        rows.map((entry, c) => GridEntry.fromWsGridEntry(entry, {r, c})),
      ),
      solution,
    );
  }
}

export default PuzzleModel;
