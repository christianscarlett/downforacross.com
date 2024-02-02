import _ from 'lodash';
import {Coord} from '../../shared/types';
import {WsEvent} from '../Events/WsEvent';
import {WsGridEntry} from '../Events/WsGridEntry';
import {WsUpdateCellEvent} from '../Events/WsUpdateCellEvent';
import GridEntry from './GridEntry';
import Direction from '../../util/Direction';

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

  private getRow(row: number): GridEntry[] {
    return [...this.grid[row]];
  }

  private getCol(col: number): GridEntry[] {
    return this.grid.map(row => row[col]);
  }

  getScopedCellsUnsorted(
    selectedIndex: number,
    cells: GridEntry[],
  ): GridEntry[] {
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

  getScopedRow(selectedCell: Coord): GridEntry[] {
    const row = this.getRow(selectedCell.r);
    const scopedCells = this.getScopedCellsUnsorted(selectedCell.c, row);
    scopedCells.sort((e1, e2) => e1.state.cell.c - e2.state.cell.c);
    return scopedCells;
  }

  getScopedCol(selectedCell: Coord): GridEntry[] {
    const col = this.getCol(selectedCell.c);
    const scopedCells = this.getScopedCellsUnsorted(selectedCell.r, col);
    scopedCells.sort((e1, e2) => e1.state.cell.r - e2.state.cell.r);
    return scopedCells;
  }

  getScopedCells(selectedCell: Coord, direction: Direction): GridEntry[] {
    switch (direction) {
      case Direction.DOWN:
        return this.getScopedCol(selectedCell);
      case Direction.ACROSS:
        return this.getScopedRow(selectedCell);
    }
  }

  getClueIndex(cell: Coord, direction: Direction): number | null {
    if (this.grid.length === 0 || this.grid[0].length === 0) {
      // Empty grid, return
      return null;
    }
    const scopedCells = this.getScopedCells(cell, direction);
    return scopedCells[0].state.number;
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
