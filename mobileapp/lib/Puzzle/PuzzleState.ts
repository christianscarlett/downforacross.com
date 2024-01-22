import {WsGridEntry} from '../Events/WsEventTypes';

class GridEntry {
  black: boolean;
  edits: [];
  number: number;
  parents: any;
  value: string;

  constructor(entry: WsGridEntry) {
    this.black = entry.black;
    this.edits = entry.edits;
    this.number = entry.number;
    this.parents = entry.parents;
    this.value = entry.value;
  }
}

class PuzzleState {
  grid: GridEntry[][];

  constructor(wsGrid: WsGridEntry[][]) {
    this.grid = wsGrid.map(rows => rows.map(entry => new GridEntry(entry)));
  }
}

export default PuzzleState;
