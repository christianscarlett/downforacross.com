import {EventEmitter} from 'events';
import {initSocket} from '../Socket/initSocket';
import {emitAsync} from '../Socket/emitAsync';

/** This class manages the websocket connection and emits its events. */
class WebsocketModel extends EventEmitter {
  gid: string | null;
  socket!: SocketIOClient.Socket;
  latency = -1;

  constructor() {
    super();
    this.gid = null;
  }

  async connect(gid: string) {
    this.gid = gid;
    this.socket = await initSocket();

    await emitAsync(this.socket, 'join_game', this.gid);

    this.socket.on('disconnect', () => {
      console.debug('received disconnect from server');
    });

    // handle future reconnects
    this.socket.on('connect', async () => {
      console.debug('rejoining game...');
      await emitAsync(this.socket, 'join_game', this.gid);
      console.debug('rejoined!');
    });

    this.socket.on('pong', (ms: number) => {
      this.latency = ms;
      this.emit('latencyUpdate', ms);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  async subscribeToWebsocketEvents() {
    if (!this.socket || !this.socket.connected) {
      throw new Error('Not connected to websocket');
    }

    this.socket.on('game_event', (event: any) => {
      this.emitWsEvent(event);
    });
    const response = await emitAsync(
      this.socket,
      'sync_all_game_events',
      this.gid,
    );
    const startTime = Date.now();
    console.debug('syncing');
    (response as any).forEach((event: any) => {
      this.emitWsEvent(event);
    });
    console.debug(`finished sync | ${Date.now() - startTime} ms`);
  }

  emitWsEvent(event: any) {
    this.emit('wsEvent', event);
  }
}

export default WebsocketModel;
