import {WsCreateEvent} from '../Events/WsEventTypes';
import HistoryModel from '../History/HistoryModel';
import {PuzzleState} from './PuzzleState';

class GameModel {
  historyModel: HistoryModel;

  constructor() {
    this.historyModel = new HistoryModel();
  }

  updateForEvent(event: any) {
    this.historyModel.pushEvent(event);
    if (event.type === 'create') {
      this.updateForCreateEvent(event);
    }

    // console.log(this.historyModel.getSortedEvents().length);
    // console.log(event);
  }

  private updateForCreateEvent(event: WsCreateEvent) {
    // console.log(event.params.game.grid);
  }

  getCurrentStateFromHistory() {
    this.historyModel.getSortedEvents().forEach(element => {
      console.log(element);
    });
  }

  get state(): PuzzleState {
    return {grid: [[]]};
  }
}

export default GameModel;
