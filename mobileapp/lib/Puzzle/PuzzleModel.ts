import {deepCopyObject} from '../../util/util';
import {WsCell} from '../Events/WsCell';
import {WsEvent} from '../Events/WsEvent';
import {WsGridEntry} from '../Events/WsGridEntry';
import {WsUpdateCellEvent} from '../Events/WsUpdateCellEvent';
import GridEntry from './GridEntry';

class PuzzleModel {
  grid: GridEntry[][];

  constructor(grid: GridEntry[][]) {
    this.grid = PuzzleModel.copyGrid(grid);
  }

  updateForEvent(event: WsEvent) {
    if (event.type === 'updateCell') {
      this.onUpdateCellEvent(event as WsUpdateCellEvent);
    }
  }

  private onUpdateCellEvent(event: WsUpdateCellEvent) {
    const {cell, value, color, pencil} = event.params;
    this.getGridEntry(cell).update({value, color, pencil});
  }

  getGridEntry(cell: WsCell): GridEntry {
    return this.grid[cell.r][cell.c];
  }

  setSyncing(syncing: boolean) {
    this.grid.forEach(row => row.forEach(entry => (entry.syncing = syncing)));
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

  static fromWsGrid(wsGrid: WsGridEntry[][]): PuzzleModel {
    return new PuzzleModel(
      wsGrid.map((rows, r) =>
        rows.map((entry, c) => GridEntry.fromWsGridEntry(entry, r, c)),
      ),
    );
  }
}

export default PuzzleModel;
