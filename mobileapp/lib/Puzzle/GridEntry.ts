import EventEmitter from 'events';
import {deepCopyObject} from '../../util/util';
import {WsGridEntry} from '../Events/WsGridEntry';

export interface GridEntryState {
  r: number;
  c: number;
  black: boolean;
  color?: string;
  edits: Array<string>;
  number: number;
  parents: any;
  pencil: boolean;
  value: string;
}

class GridEntry extends EventEmitter {
  state: GridEntryState;
  syncing: boolean = false;

  constructor(state: GridEntryState) {
    super();
    this.state = state;
  }

  getState(): GridEntryState {
    return {
      ...this.state,
    };
  }

  update(newState: Partial<GridEntryState>) {
    this.state = GridEntry.copyState({...this.state, ...newState});
    this.emitUpdate();
  }

  emitUpdate() {
    if (!this.syncing) {
      this.emit('update');
    }
  }

  copy(): GridEntry {
    return new GridEntry(GridEntry.copyState(this.state));
  }

  static copyState(state: GridEntryState): GridEntryState {
    return {
      ...state,
      edits: deepCopyObject(state.edits),
    };
  }

  static makeState(
    r: number,
    c: number,
    black: boolean,
    edits: Array<string>,
    number: number,
    parents: any,
    value: string,
  ): GridEntryState {
    return {
      r,
      c,
      black,
      edits,
      number,
      parents,
      pencil: false,
      value,
    };
  }

  static fromWsGridEntry(entry: WsGridEntry, r: number, c: number): GridEntry {
    return new GridEntry(
      GridEntry.makeState(
        r,
        c,
        entry.black,
        entry.edits,
        entry.number,
        entry.parents,
        entry.value,
      ),
    );
  }

  static getEmpty(): GridEntry {
    return new GridEntry(GridEntry.makeState(0, 0, false, [], 1, [], 'A'));
  }
}

export default GridEntry;
