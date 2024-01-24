import {deepCopyObject} from '../../util/util';
import {WsEvent, WsGridEntry, WsUpdateCellEvent} from '../Events/WsEventTypes';

export class GridEntry {
  black: boolean;
  edits: Array<string>;
  number: number;
  parents: any;
  value: string;

  constructor(
    black: boolean,
    edits: Array<string>,
    number: number,
    parents: any,
    value: string,
  ) {
    this.black = black;
    this.edits = edits;
    this.number = number;
    this.parents = parents;
    this.value = value;
  }

  updateValue(value: string): GridEntry {
    return new GridEntry(
      this.black,
      deepCopyObject(this.edits),
      this.number,
      this.parents,
      value,
    );
  }

  copy(): GridEntry {
    return new GridEntry(
      this.black,
      deepCopyObject(this.edits),
      this.number,
      this.parents,
      this.value,
    );
  }

  static fromWsGridEntry(entry: WsGridEntry): GridEntry {
    return new GridEntry(
      entry.black,
      entry.edits,
      entry.number,
      entry.parents,
      entry.value,
    );
  }

  static getEmpty(): GridEntry {
    return new GridEntry(false, [], 1, [], 'A');
  }
}

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
    this.grid[cell.r][cell.c].value = value;
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
