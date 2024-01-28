import EventEmitter from 'events';
import {
  WsChatEvent,
  WsCreateEvent,
  WsEvent,
  WsUpdateDisplayNameEvent,
} from '../Events/WsEventTypes';
import HistoryModel from '../History/HistoryModel';
import PuzzleState from './PuzzleState';
import PlayerStateManager from './PlayerStateManager';
import PuzzleInfo from './PuzzleInfo';
import ChatModel from './ChatModel';

class GameModel extends EventEmitter {
  historyModel: HistoryModel = new HistoryModel();
  playerStateManager: PlayerStateManager = new PlayerStateManager();
  puzzleState: PuzzleState = new PuzzleState([], this.playerStateManager);
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
      this.puzzleState.updateForEvent(event);
    }
  }

  private onChatEvent(event: WsChatEvent) {
    const {senderId, text} = event.params;
    this.chatModel.pushMessage(senderId, text, event.timestamp);
    this.emitUpdate();
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
