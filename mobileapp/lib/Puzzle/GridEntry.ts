import EventEmitter from 'events';
import {deepCopyObject} from '../../util/util';
import {WsGridEntry} from '../Events/WsEventTypes';

export interface GridEntryState {
  black: boolean;
  edits: Array<string>;
  number: number;
  parents: any;
  value: string;
}

class GridEntry extends EventEmitter {
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
    super();
    this.black = black;
    this.edits = edits;
    this.number = number;
    this.parents = parents;
    this.value = value;
  }

  getState(): GridEntryState {
    return {
      ...this,
    };
  }

  updateValue(newValue: string) {
    this.value = newValue;
    this.emitUpdate();
  }

  emitUpdate() {
    this.emit('update');
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

export default GridEntry;
