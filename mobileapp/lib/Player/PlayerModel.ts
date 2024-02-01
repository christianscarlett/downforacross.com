import EventEmitter from 'events';
import PlayerState from './PlayerState';

class PlayerModel extends EventEmitter {
  private idToState: Map<string, PlayerState>;

  constructor() {
    super();
    this.idToState = new Map();
  }

  updateState(id: string, update: Partial<PlayerState>) {
    const state = this.idToState.get(id) ?? this.createNewState(id);
    this.idToState.set(id, {...state, ...update});
    this.emit('update');
  }

  getState(id: string): PlayerState | undefined {
    return this.idToState.get(id);
  }

  getAllStates(): PlayerState[] {
    return [...this.idToState.values()];
  }

  createNewState(id: string): PlayerState {
    return {
      id,
      color: 'blue',
      cursorPos: {c: 0, r: 0},
      displayName: '',
    };
  }
}

export default PlayerModel;
