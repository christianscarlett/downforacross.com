import {EventEmitter} from 'events';
import WebsocketModel from './WebsocketModel';
import GameModel from './GameModel';

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
  }

  emitUpdate() {
    this.emit('gameModelUpdate');
  }

  async connect() {
    this.gameModel.setSyncing(true);
    await this.wsModel.connect(this.gid);
    await this.wsModel.subscribeToWebsocketEvents();
    this.gameModel.setSyncing(false);
    this.emitUpdate();
  }

  async disconnect() {
    this.wsModel.disconnect();
  }
}

export default GameManager;
