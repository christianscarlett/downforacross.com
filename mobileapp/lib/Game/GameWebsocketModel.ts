import {EventEmitter} from 'events';
import {initSocket} from '../Socket/initSocket';
import {emitAsync} from '../Socket/emitAsync';

class GameWebsocketModel extends EventEmitter {
  gid: string;
  socket!: SocketIOClient.Socket;
  latency = -1;
  isConnected = false;

  constructor(gid: string) {
    super();
    this.gid = gid;
  }

  async connectToWebsocket() {
    if (this.isConnected) {
      return;
    }
    this.socket = await initSocket();
    this.isConnected = true;

    await emitAsync(this.socket, 'join_game', this.gid);

    this.socket.on('disconnect', () => {
      console.log('received disconnect from server');
    });

    // handle future reconnects
    this.socket.on('connect', async () => {
      console.log('reconnecting...');
      await emitAsync(this.socket, 'join_game', this.gid);
      console.log('reconnected...');
      this.emitReconnect();
    });

    this.socket.on('pong', (ms: number) => {
      this.latency = ms;
      this.emit('latencyUpdate', ms);
    });
  }

  emitReconnect() {
    this.emit('reconnect');
  }

  disconnect() {
    this.socket.disconnect();
    this.isConnected = false;
  }

  async subscribeToWebsocketEvents() {
    if (!this.socket || !this.socket.connected) {
      throw new Error('Not connected to websocket');
    }

    this.socket.on('game_event', (event: any) => {
      this.emitWSEvent(event);
    });
    const response = await emitAsync(
      this.socket,
      'sync_all_game_events',
      this.gid,
    );
    (response as any).forEach((event: any) => {
      this.emitWSEvent(event);
    });
  }

  emitWSEvent(event: any) {
    if (event.type === 'create') {
      this.emit('wsCreateEvent', event);
    } else {
      this.emit('wsEvent', event);
    }
  }
}

export default GameWebsocketModel;
