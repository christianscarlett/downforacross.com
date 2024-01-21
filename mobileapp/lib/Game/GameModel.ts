import {EventEmitter} from 'events';
import {initSocket} from '../Socket/initSocket';
import {emitAsync} from '../Socket/emitAsync';

class GameModel extends EventEmitter {
  gid: string;
  socket!: SocketIOClient.Socket;
  latency = -1;
  isConnected = false;

  constructor(gid: string) {
    super();
    this.gid = gid;
  }

  async connectToWebsocket() {
    console.log('here');
    if (this.isConnected) {
      return;
    }
    console.log('here2');
    this.socket = await initSocket();
    this.isConnected = true;
    console.log('here3: ' + this.socket);

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
}

export default GameModel;
