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
    // Dummy placeholders
    this.gid = '';
    this.wsModel = new WebsocketModel('');
    this.gameModel = new GameModel();
  }

  init(gid: string) {
    this.gid = gid;
    this.wsModel = new WebsocketModel(this.gid);
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
    this.emit('update');
  }

  async connect() {
    await this.wsModel?.connectToWebsocket();
    await this.wsModel?.subscribeToWebsocketEvents();
  }

  async disconnect() {
    this.wsModel?.disconnect();
  }
}

export default GameManager;
