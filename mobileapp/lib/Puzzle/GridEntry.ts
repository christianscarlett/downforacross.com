import _ from 'lodash';
import {Coord} from '../../shared/types';
import {WsGridEntry} from '../Events/WsGridEntry';

export enum CheckState {
  CORRECT,
  INCORRECT,
  REVEALED,
  NONE,
}

export interface GridEntryState {
  cell: Coord;
  black: boolean;
  color?: string;
  edits: Array<string>;
  number: number | null;
  parents: any;
  pencil: boolean;
  value: string;
  checkState: CheckState;
}

class GridEntry {
  state: GridEntryState;

  constructor(state: GridEntryState) {
    this.state = state;
  }

  isEditable(): boolean {
    return (
      this.state.checkState !== CheckState.CORRECT &&
      this.state.checkState !== CheckState.REVEALED
    );
  }

  update(newState: Partial<GridEntryState>) {
    this.state = _.cloneDeep({...this.state, ...newState});
  }

  static makeState(
    cell: Coord,
    black: boolean,
    edits: Array<string>,
    number: number,
    parents: any,
    value: string,
  ): GridEntryState {
    return {
      cell,
      black,
      edits,
      number,
      parents,
      pencil: false,
      value,
      checkState: CheckState.NONE,
    };
  }

  static fromWsGridEntry(entry: WsGridEntry, cell: Coord): GridEntry {
    return new GridEntry(
      GridEntry.makeState(
        cell,
        entry.black,
        entry.edits,
        entry.number,
        entry.parents,
        entry.value,
      ),
    );
  }
}

export default GridEntry;
