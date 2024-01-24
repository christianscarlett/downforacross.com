import EventEmitter from 'events';
import {WsCreateEvent, WsEvent} from '../Events/WsEventTypes';
import HistoryModel from '../History/HistoryModel';
import PuzzleState from './PuzzleState';

class GameModel extends EventEmitter {
  historyModel: HistoryModel;
  puzzleState: PuzzleState;

  constructor() {
    super();
    this.historyModel = new HistoryModel();
    this.puzzleState = PuzzleState.getEmpty();
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
    this.puzzleState = PuzzleState.fromWsGrid(event.params.game.grid);
    this.emitUpdate();
  }

  private emitUpdate() {
    this.emit('update');
  }
}

export default GameModel;
