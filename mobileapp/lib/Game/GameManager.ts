import {EventEmitter} from 'events';
import {Coord} from '../../shared/types';
import Direction from '../../util/Direction';
import Scope from '../Puzzle/Scopes';
import GameModel from './GameModel';
import WebsocketModel from './WebsocketModel';

/** This class acts as a bridge between the websocket and the model of the game. */
class GameManager extends EventEmitter {
  gid: string;
  wsModel: WebsocketModel;
  gameModel: GameModel;

  constructor() {
    super();
    this.gid = '';
    this.wsModel = new WebsocketModel();
    this.gameModel = new GameModel();
  }

  init(gid: string) {
    this.gid = gid;
    this.wsModel = new WebsocketModel();
    this.gameModel = new GameModel();
    this.initGameListeners();
  }

  private initGameListeners() {
    this.wsModel.on('wsEvent', (event: any) => {
      this.gameModel.updateForEvent(event);
    });
    this.gameModel.on('update', () => {
      this.emitUpdate();
    });
    this.gameModel.on('userCursorUpdate', () => {
      this.onUserCursorUpdate();
    });
  }

  emitUpdate() {
    this.emit('gameModelUpdate');
  }

  onKeyboardInput(input: string, pencil: boolean) {
    const selectedCell = this.gameModel.getSelectedCell();
    const value = this.gameModel.onKeyboardInput(input, pencil);
    if (value !== null && selectedCell.isEditable()) {
      this.wsModel.updateCell(
        selectedCell.state.cell,
        'test_id',
        '#32a852',
        pencil,
        value,
      );
    }
  }

  onUserCursorUpdate() {
    const selectedCell = this.gameModel.getSelectedCoord();
    this.wsModel.updateCursor(selectedCell, 'test_id');
  }

  getScopedCoords(scope: Scope): Coord[] {
    switch (scope) {
      case Scope.SQUARE: {
        return [this.gameModel.getSelectedCoord()];
      }
      case Scope.WORD: {
        return this.gameModel.getWordScopedCoords();
      }
      case Scope.PUZZLE: {
        return this.gameModel.getWhiteCoords();
      }
    }
  }

  onChat(message: string) {
    const {id, displayName} = this.gameModel.userModel.playerState;
    this.wsModel.chat(message, id, displayName);
  }

  onCheck(scope: Scope) {
    const coords = this.getScopedCoords(scope);
    this.wsModel.check(coords);
  }

  onReveal(scope: Scope) {
    const coords = this.getScopedCoords(scope);
    this.wsModel.reveal(coords);
  }

  onReset(scope: Scope) {
    const coords = this.getScopedCoords(scope);
    this.wsModel.reset(coords);
  }

  selectNextClue(clueIndex: number) {
    this.gameModel.selectNextClue(clueIndex);
  }

  selectPreviousClue(clueIndex: number) {
    this.gameModel.selectNextClue(clueIndex, true);
  }

  selectClue(clueIndex: number, direction: Direction) {
    this.gameModel.selectClue(clueIndex, direction);
  }

  initUser() {
    const {id, playerState} = this.gameModel.userModel.state;
    this.wsModel.updateColor(playerState.color, id);
    this.wsModel.updateDisplayName(playerState.displayName, id);
  }

  async connect() {
    this.gameModel.setSyncing(true);
    await this.wsModel.connect(this.gid);
    await this.wsModel.subscribeToWebsocketEvents();
    this.gameModel.setSyncing(false);
    this.emitUpdate();
    this.initUser();
  }

  async disconnect() {
    this.wsModel.disconnect();
  }
}

export default GameManager;
