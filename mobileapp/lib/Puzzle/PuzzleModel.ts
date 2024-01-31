import {deepCopyObject, withItems} from '../../util/util';
import {
  WsCell,
  WsEvent,
  WsGridEntry,
  WsUpdateCellEvent,
  WsUpdateColorEvent,
  WsUpdateCursorEvent,
} from '../Events/WsEventTypes';
import CursorState from './CursorState';
import GridEntry from './GridEntry';
import PlayerModel from '../Player/PlayerModel';

class PuzzleModel {
  grid: GridEntry[][];
  playerModel: PlayerModel;

  constructor(grid: GridEntry[][], playerModel: PlayerModel) {
    this.grid = PuzzleModel.copyGrid(grid);
    this.playerModel = playerModel;
  }

  updateForEvent(event: WsEvent) {
    if (event.type === 'updateCell') {
      this.onUpdateCellEvent(event as WsUpdateCellEvent);
    } else if (event.type === 'updateCursor') {
      this.onUpdateCursorEvent(event as WsUpdateCursorEvent);
    } else if (event.type === 'updateColor') {
      this.onUpdateColorEvent(event as WsUpdateColorEvent);
    }
  }

  private onUpdateColorEvent(event: WsUpdateColorEvent) {
    const {id, color} = event.params;
    this.playerModel.updateState(id, {
      color: color,
    });
    const state = this.playerModel.getState(id);
    if (state) {
      this.getGridEntry(state.cursorPos).updateCursor(id, color);
    }
  }

  private onUpdateCellEvent(event: WsUpdateCellEvent) {
    const {cell, value, color, pencil} = event.params;
    this.getGridEntry(cell).update({value, color, pencil});
  }

  private onUpdateCursorEvent(event: WsUpdateCursorEvent) {
    const {cell, id} = event.params;
    // Remove cursor from previous cell
    const oldState = this.playerModel.getState(id);
    if (oldState != null) {
      const oldGridEntry = this.getGridEntry(oldState.cursorPos);
      oldGridEntry.update({
        cursors: oldGridEntry
          .getState()
          .cursors.filter(cursor => cursor.id !== id),
      });
    }
    // Add cursor to new cell
    const newGridEntry = this.getGridEntry(cell);
    newGridEntry.update({
      cursors: withItems(newGridEntry.getState().cursors, [
        new CursorState(id, this.playerModel.getState(id)?.color ?? 'white'),
      ]),
    });
    // Update player state
    this.playerModel.updateState(id, {cursorPos: cell});
  }

  getGridEntry(cell: WsCell): GridEntry {
    return this.grid[cell.r][cell.c];
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

  static fromWsGrid(
    wsGrid: WsGridEntry[][],
    playerState: PlayerModel,
  ): PuzzleModel {
    return new PuzzleModel(
      wsGrid.map((rows, r) =>
        rows.map((entry, c) => GridEntry.fromWsGridEntry(entry, r, c)),
      ),
      playerState,
    );
  }
}

export default PuzzleModel;
