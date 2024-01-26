import EventEmitter from 'events';
import {deepCopyObject} from '../../util/util';
import {WsGridEntry} from '../Events/WsEventTypes';

export interface GridEntryState {
  black: boolean;
  color?: string;
  edits: Array<string>;
  number: number;
  parents: any;
  value: string;
}

class GridEntry extends EventEmitter {
  state: GridEntryState;

  constructor(state: GridEntryState) {
    super();
    this.state = state;
  }

  getState(): GridEntryState {
    return {
      ...this.state,
    };
  }

  update(newState: GridEntryState) {
    this.state = GridEntry.copyState(newState);
    this.emitUpdate();
  }

  emitUpdate() {
    this.emit('update');
  }

  copy(): GridEntry {
    return new GridEntry(GridEntry.copyState(this.state));
  }

  static copyState(state: GridEntryState): GridEntryState {
    return {...state, edits: deepCopyObject(state.edits)};
  }

  static makeState(
    black: boolean,
    edits: Array<string>,
    number: number,
    parents: any,
    value: string,
  ): GridEntryState {
    return {
      black: black,
      edits: edits,
      number: number,
      parents: parents,
      value: value,
    };
  }

  static fromWsGridEntry(entry: WsGridEntry): GridEntry {
    return new GridEntry(
      GridEntry.makeState(
        entry.black,
        entry.edits,
        entry.number,
        entry.parents,
        entry.value,
      ),
    );
  }

  static getEmpty(): GridEntry {
    return new GridEntry(GridEntry.makeState(false, [], 1, [], 'A'));
  }
}

export default GridEntry;
