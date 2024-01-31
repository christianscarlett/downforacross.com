import EventEmitter from 'events';
import ChatModel from '../Chat/ChatModel';
import {WsChatEvent} from '../Events/WsChatEvent';
import {WsCreateEvent} from '../Events/WsCreateEvent';
import {WsUpdateDisplayNameEvent} from '../Events/WsUpdateDisplayNameEvent';
import HistoryModel from '../History/HistoryModel';
import PlayerModel from '../Player/PlayerModel';
import PuzzleModel from '../Puzzle/PuzzleModel';
import PuzzleInfo from './PuzzleInfo';
import {WsUpdateColorEvent} from '../Events/WsUpdateColorEvent';
import {WsUpdateCursorEvent} from '../Events/WsUpdateCursorEvent';

class GameModel extends EventEmitter {
  historyModel: HistoryModel = new HistoryModel();
  playerModel: PlayerModel = new PlayerModel();
  puzzleModel: PuzzleModel = new PuzzleModel([]);
  puzzleInfo: PuzzleInfo | null = null;
  chatModel: ChatModel = new ChatModel();

  private syncing: boolean = false;

  events = new Set();
  updateForEvent(event: any) {
    this.historyModel.pushEvent(event);
    if (event.type === 'create') {
      this.onCreateEvent(event);
    } else if (event.type === 'updateDisplayName') {
      this.onUpdateDisplayNameEvent(event as WsUpdateDisplayNameEvent);
    } else if (event.type === 'chat') {
      this.onChatEvent(event as WsChatEvent);
    } else if (event.type === 'updateCursor') {
      this.onUpdateCursorEvent(event as WsUpdateCursorEvent);
    } else if (event.type === 'updateColor') {
      this.onUpdateColorEvent(event as WsUpdateColorEvent);
    } else {
      this.puzzleModel.updateForEvent(event);
    }
    if (!this.events.has(event.type)) {
      // console.log(event.type);
      this.events.add(event.type);
    }
    this.emitUpdate();
  }

  private onUpdateColorEvent(event: WsUpdateColorEvent) {
    const {id, color} = event.params;
    this.playerModel.updateState(id, {
      color: color,
    });
  }

  private onUpdateCursorEvent(event: WsUpdateCursorEvent) {
    const {cell, id} = event.params;
    this.playerModel.updateState(id, {cursorPos: cell});
  }

  private onChatEvent(event: WsChatEvent) {
    const {senderId, text} = event.params;
    this.chatModel.pushMessage(senderId, text, event.timestamp);
  }

  private onUpdateDisplayNameEvent(event: WsUpdateDisplayNameEvent) {
    const {id, displayName} = event.params;
    this.playerModel.updateState(id, {displayName});
  }

  private onCreateEvent(event: WsCreateEvent) {
    this.puzzleModel = PuzzleModel.fromWsGrid(event.params.game.grid);
    this.puzzleInfo = {...event.params.game.info};
  }

  setSyncing(syncing: boolean) {
    this.syncing = syncing;
    this.puzzleModel.setSyncing(syncing);
  }

  private emitUpdate() {
    if (!this.syncing) {
      this.emit('update');
    }
  }
}

export default GameModel;
