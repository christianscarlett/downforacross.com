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
import Direction from '../../util/Direction';
import CluesInfo from './Clues';

class GameModel extends EventEmitter {
  historyModel: HistoryModel = new HistoryModel();
  playerModel: PlayerModel = new PlayerModel();
  puzzleModel: PuzzleModel = new PuzzleModel([], []);
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
    const {game} = event.params;
    this.puzzleModel = PuzzleModel.fromWsGrid(game.grid, game.solution);
    this.puzzleInfo = {...game.info};
    const {across, down} = game.clues;
    this.cluesInfo = new CluesInfo(across, down);
  }

  onCellTap(cell: Coord) {
    if (this.puzzleModel.getGridEntry(cell).state.black) {
      return;
    }

    if (areCoordsEqual(this.getSelectedCell(), cell)) {
      this.userModel.toggleDirection();
    } else {
      this.updateUserCursorPos(cell);
    }
    this.emitUpdate();
  }

  private updateUserCursorPos(cell: Coord) {
    this.userModel.update({
      playerState: {...this.userModel.playerState, cursorPos: cell},
    });
    this.emitUserCursorUpdate();
  }

  getSelectedClueIndex(): number | null {
    return this.getClueIndex(this.getSelectedCell(), this.userModel.direction);
  }

  getClueIndex(cell: Coord, direction: Direction): number | null {
    return this.puzzleModel.getClueIndex(cell, direction);
  }

  getScopedCells(): Coord[] {
    return this.puzzleModel
      .getScopedCells(this.getSelectedCell(), this.userModel.direction)
      .map(entry => entry.state.cell);
  }

  /** Process keyboard input. Returns the processed value if ingested. Returns null if the value was not ingested. */
  onKeyboardInput(input: string): string | null {
    // Handle space
    if (input === ' ') {
      this.userModel.toggleDirection();
      this.emitUpdate();
      return null;
    }
    // Handle backspace
    if (input === 'Backspace') {
      return this.updateSelectedCellValue('', true);
    }
    // Process input
    input = input.toUpperCase().trim();
    // Reject invalid characters
    if (!isValidInput(input)) {
      return null;
    }
    // Handle input
    return this.updateSelectedCellValue(input);
  }

  private updateSelectedCellValue(
    value: string,
    isBackspace: boolean = false,
  ): string | null {
    const cell = this.getSelectedCell();
    if (cell) {
      this.puzzleModel.updateCellValue(value, cell);
      this.updateUserCursorPos(
        this.puzzleModel.getNextCell(
          cell,
          this.userModel.direction,
          isBackspace,
        ),
      );
      this.emitUpdate();
      return value;
    }
    return null;
  }

  getSelectedCell(): Coord {
    return this.userModel.playerState.cursorPos;
  }

  setSyncing(syncing: boolean) {
    this.syncing = syncing;
  }

  private emitUserCursorUpdate() {
    this.emit('userCursorUpdate');
  }

  private emitUpdate() {
    if (!this.syncing) {
      this.emit('update');
    }
  }
}

export default GameModel;
