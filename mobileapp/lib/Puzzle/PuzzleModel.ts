import _ from 'lodash';
import {Coord} from '../../shared/types';
import {WsEvent} from '../Events/WsEvent';
import {WsGridEntry} from '../Events/WsGridEntry';
import {WsUpdateCellEvent} from '../Events/WsUpdateCellEvent';
import GridEntry from './GridEntry';

class PuzzleModel {
  grid: GridEntry[][];

  constructor(grid: GridEntry[][]) {
    this.grid = _.cloneDeep(grid);
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

  getGridEntry(cell: Coord): GridEntry {
    return this.grid[cell.r][cell.c];
  }

  static fromWsGrid(wsGrid: WsGridEntry[][]): PuzzleModel {
    return new PuzzleModel(
      wsGrid.map((rows, r) =>
        rows.map((entry, c) => GridEntry.fromWsGridEntry(entry, {r, c})),
      ),
    );
  }
}

export default PuzzleModel;
