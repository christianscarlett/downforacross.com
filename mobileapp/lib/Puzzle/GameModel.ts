import EventEmitter from 'events';
import {
  WsCreateEvent,
  WsEvent,
  WsUpdateDisplayNameEvent,
} from '../Events/WsEventTypes';
import HistoryModel from '../History/HistoryModel';
import PuzzleState from './PuzzleState';
import PlayerStateManager from './PlayerStateManager';
import PuzzleInfo from './PuzzleInfo';

class GameModel extends EventEmitter {
  historyModel: HistoryModel;
  playerStateManager: PlayerStateManager;
  puzzleState: PuzzleState;
  puzzleInfo: PuzzleInfo | null = null;

  constructor() {
    super();
    this.historyModel = new HistoryModel();
    this.playerStateManager = new PlayerStateManager();
    this.puzzleState = new PuzzleState([], this.playerStateManager);
  }

  events = new Set();
  updateForEvent(event: any) {
    this.historyModel.pushEvent(event);
    if (event.type === 'create') {
      this.onCreateEvent(event);
    } else {
      this.updateForOtherEvent(event);
    }
    if (!this.events.has(event.type)) {
      // console.log(event.type);
      this.events.add(event.type);
    }
  }

  private updateForOtherEvent(event: WsEvent) {
    if (event.type === 'updateDisplayName') {
      this.onUpdateDisplayNameEvent(event as WsUpdateDisplayNameEvent);
    } else {
      this.puzzleState.updateForEvent(event);
    }
  }

  private onUpdateDisplayNameEvent(event: WsUpdateDisplayNameEvent) {
    const {id, displayName} = event.params;
    this.playerStateManager.updateState(id, {displayName});
    this.emitUpdate();
  }

  private onCreateEvent(event: WsCreateEvent) {
    this.puzzleState = PuzzleState.fromWsGrid(
      event.params.game.grid,
      this.playerStateManager,
    );
    this.puzzleInfo = {...event.params.game.info};
    this.emitUpdate();
  }

  private emitUpdate() {
    this.emit('update');
  }
}

export default GameModel;
