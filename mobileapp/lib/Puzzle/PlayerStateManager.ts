import EventEmitter from 'events';
import {WsCell} from '../Events/WsEventTypes';

export interface PlayerState {
  color: string;
  cursorPos: WsCell;
  displayName: string;
}

class PlayerStateManager extends EventEmitter {
  private idToState: Map<string, PlayerState>;

  constructor() {
    super();
    this.idToState = new Map();
  }

  updateState(id: string, update: Partial<PlayerState>) {
    const state = this.idToState.get(id) ?? this.createNewState();
    this.idToState.set(id, {...state, ...update});
    this.emit('update');
  }

  getState(id: string): PlayerState | undefined {
    return this.idToState.get(id);
  }

  getAllStates(): Map<string, PlayerState> {
    return this.idToState;
  }

  createNewState(): PlayerState {
    return {
      color: 'blue',
      cursorPos: {c: 0, r: 0},
      displayName: '',
    };
  }
}

export default PlayerStateManager;
