import EventEmitter from 'events';
import {WsCreateEvent} from '../Events/WsEventTypes';
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
    }
  }

  private updateForCreateEvent(event: WsCreateEvent) {
    this.puzzleState = new PuzzleState(event.params.game.grid);
    this.emitUpdate();
  }

  private emitUpdate() {
    this.emit('update');
  }
}

export default GameModel;
