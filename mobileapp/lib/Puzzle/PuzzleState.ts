import {deepCopyObject} from '../../util/util';
import {WsEvent, WsGridEntry, WsUpdateCellEvent} from '../Events/WsEventTypes';
import GridEntry from './GridEntry';

class PuzzleState {
  grid: GridEntry[][];

  constructor(grid: GridEntry[][]) {
    this.grid = PuzzleState.copyGrid(grid);
  }

  updateForEvent(event: WsEvent) {
    if (event.type === 'updateCell') {
      this.updateForUpdateCellEvent(event as WsUpdateCellEvent);
    }
  }

  private updateForUpdateCellEvent(event: WsUpdateCellEvent) {
    const {cell, value} = event.params;
    this.grid[cell.r][cell.c].updateValue(value);
  }

  static copyGrid(grid: GridEntry[][]): GridEntry[][] {
    const copy = deepCopyObject(grid);
    for (let r = 0; r < copy.length; r++) {
      for (let c = 0; c < copy[r].length; c++) {
        copy[r][c] = grid[r][c].copy();
      }
    }
    return copy;
  }

  static fromWsGrid(wsGrid: WsGridEntry[][]): PuzzleState {
    return new PuzzleState(
      wsGrid.map(rows => rows.map(entry => GridEntry.fromWsGridEntry(entry))),
    );
  }

  static getEmpty(): PuzzleState {
    return new PuzzleState([]);
  }
}

export default PuzzleState;
