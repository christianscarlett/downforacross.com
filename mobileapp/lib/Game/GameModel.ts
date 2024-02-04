import EventEmitter from 'events';
import ChatModel from '../Chat/ChatModel';
import {WsChatEvent} from '../Events/WsChatEvent';
import {WsCreateEvent} from '../Events/WsCreateEvent';
import {WsUpdateColorEvent} from '../Events/WsUpdateColorEvent';
import {WsUpdateCursorEvent} from '../Events/WsUpdateCursorEvent';
import {WsUpdateDisplayNameEvent} from '../Events/WsUpdateDisplayNameEvent';
import HistoryModel from '../History/HistoryModel';
import PlayerModel from '../Player/PlayerModel';
import PuzzleModel from '../Puzzle/PuzzleModel';
import UserModel from '../User/UserModel';
import PuzzleInfo from './PuzzleInfo';
import {Coord} from '../../shared/types';
import {areCoordsEqual, isValidInput} from '../../util/util';
import Direction, {toggleDirection} from '../../util/Direction';
import CluesInfo from './Clues';

class GameModel extends EventEmitter {
  historyModel: HistoryModel = new HistoryModel();
  playerModel: PlayerModel = new PlayerModel();
  puzzleModel: PuzzleModel = new PuzzleModel([]);
  puzzleInfo: PuzzleInfo | null = null;
  chatModel: ChatModel = new ChatModel();
  userModel: UserModel = new UserModel();
  cluesInfo: CluesInfo = new CluesInfo([], []);

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
      console.log(event.type);
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
    const {across, down} = event.params.game.clues;
    this.cluesInfo = new CluesInfo(across, down);
  }

  onCellTap(cell: Coord) {
    if (this.puzzleModel.getGridEntry(cell).state.black) {
      return;
    }

    if (areCoordsEqual(this.userModel.playerState.cursorPos, cell)) {
      this.userModel.update({
        ...this.userModel.state,
        direction: toggleDirection(this.userModel.direction),
      });
    } else {
      this.userModel.update({
        playerState: {...this.userModel.playerState, cursorPos: cell},
      });
    }
    this.emitUpdate();
  }

  getSelectedClueIndex(): number | null {
    return this.getClueIndex(
      this.userModel.playerState.cursorPos,
      this.userModel.direction,
    );
  }

  getClueIndex(cell: Coord, direction: Direction): number | null {
    return this.puzzleModel.getClueIndex(cell, direction);
  }

  getScopedCells(): Coord[] {
    return this.puzzleModel
      .getScopedCells(
        this.userModel.playerState.cursorPos,
        this.userModel.direction,
      )
      .map(entry => entry.state.cell);
  }

  /** Process keyboard input. Returns true if value was ingested, false otherwise. */
  onKeyboardInput(input: string): boolean {
    const cell = this.getSelectedCell();
    // Handle backspace
    if (input === 'Backspace' && cell) {
      this.puzzleModel.onKeyboardInput('', cell);
      this.emitUpdate();
      return true;
    }
    // Process input
    input = input.toUpperCase().trim();
    // Reject invalid characters
    if (!isValidInput(input)) {
      return false;
    }
    // Handle input
    if (cell) {
      this.puzzleModel.onKeyboardInput(input, cell);
      this.emitUpdate();
    }
    return true;
  }

  private getSelectedCell(): Coord {
    return this.userModel.playerState.cursorPos;
  }

  setSyncing(syncing: boolean) {
    this.syncing = syncing;
  }

  private emitUpdate() {
    if (!this.syncing) {
      this.emit('update');
    }
  }
}

export default GameModel;
