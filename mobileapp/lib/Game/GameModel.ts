import EventEmitter from 'events';
import ChatModel from '../Chat/ChatModel';
import {WsChatEvent} from '../Events/WsChatEvent';
import {WsCreateEvent} from '../Events/WsCreateEvent';
import {WsEvent} from '../Events/WsEvent';
import {WsUpdateDisplayNameEvent} from '../Events/WsUpdateDisplayNameEvent';
import HistoryModel from '../History/HistoryModel';
import PlayerModel from '../Player/PlayerModel';
import PuzzleModel from '../Puzzle/PuzzleModel';
import PuzzleInfo from './PuzzleInfo';

class GameModel extends EventEmitter {
  historyModel: HistoryModel = new HistoryModel();
  playerModel: PlayerModel = new PlayerModel();
  puzzleModel: PuzzleModel = new PuzzleModel([], this.playerModel);
  puzzleInfo: PuzzleInfo | null = null;
  chatModel: ChatModel = new ChatModel();

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
    } else if (event.type === 'chat') {
      this.onChatEvent(event as WsChatEvent);
    } else {
      this.puzzleModel.updateForEvent(event);
    }
  }

  private onChatEvent(event: WsChatEvent) {
    const {senderId, text} = event.params;
    this.chatModel.pushMessage(senderId, text, event.timestamp);
    this.emitUpdate();
  }

  private onUpdateDisplayNameEvent(event: WsUpdateDisplayNameEvent) {
    const {id, displayName} = event.params;
    this.playerModel.updateState(id, {displayName});
    this.emitUpdate();
  }

  private onCreateEvent(event: WsCreateEvent) {
    this.puzzleModel = PuzzleModel.fromWsGrid(
      event.params.game.grid,
      this.playerModel,
    );
    this.puzzleInfo = {...event.params.game.info};
    this.emitUpdate();
  }

  private emitUpdate() {
    this.emit('update');
  }
}

export default GameModel;
