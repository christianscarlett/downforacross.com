import {EventEmitter} from 'events';
import GameWebsocketModel from './GameWebsocketModel';
import GameModel from '../Puzzle/GameModel';

class GameManager extends EventEmitter {
  gid: string;
  gameWsModel: GameWebsocketModel;
  gameModel: GameModel;

  constructor(gid: string) {
    super();
    this.gid = gid;
    this.gameWsModel = new GameWebsocketModel(this.gid);
    this.gameModel = new GameModel();
    this.initGameListeners();
  }

  reset() {
    this.gameModel = new GameModel();
  }

  private initGameListeners() {
    this.gameWsModel.on('wsCreateEvent', (event: any) => {
      this.gameModel.updateForEvent(event);
    });
    this.gameWsModel.on('wsEvent', (event: any) => {
      this.gameModel.updateForEvent(event);
    });
  }

  async connect() {
    await this.gameWsModel.connectToWebsocket();
    await this.gameWsModel.subscribeToWebsocketEvents();
  }

  async disconnect() {
    this.gameWsModel.disconnect();
  }

  // get puzzleState() {
  //   return this.gameModel.getCurrentStateFromHistory();
  // }
}

export default GameManager;
