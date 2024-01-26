import EventEmitter from 'events';
import {WsCreateEvent, WsEvent} from '../Events/WsEventTypes';
import HistoryModel from '../History/HistoryModel';
import PuzzleState from './PuzzleState';
import PlayerStateManager from './PlayerStateManager';

class GameModel extends EventEmitter {
  historyModel: HistoryModel;
  playerStateManager: PlayerStateManager;
  puzzleState: PuzzleState;

  constructor() {
    super();
    this.historyModel = new HistoryModel();
    this.playerStateManager = new PlayerStateManager();
    this.puzzleState = new PuzzleState([], this.playerStateManager);
  }

  updateForEvent(event: any) {
    this.historyModel.pushEvent(event);
    if (event.type === 'create') {
      this.updateForCreateEvent(event);
    } else {
      this.updateForOtherEvent(event);
    }
  }

  private updateForOtherEvent(event: WsEvent) {
    this.puzzleState.updateForEvent(event);
    this.emitUpdate();
  }

  private updateForCreateEvent(event: WsCreateEvent) {
    this.puzzleState = PuzzleState.fromWsGrid(
      event.params.game.grid,
      this.playerStateManager,
    );
    this.emitUpdate();
  }

  private emitUpdate() {
    this.emit('update');
  }
}

export default GameModel;
