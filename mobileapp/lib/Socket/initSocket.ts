import io from 'socket.io-client';
import {SOCKET_HOST} from '../../api/constants';

let websocketPromise: Promise<SocketIOClient.Socket>;
export const initSocket = () => {
  websocketPromise = (async () => {
    // Note: In attempt to increase websocket limit, use upgrade false
    // https://stackoverflow.com/questions/15872788/maximum-concurrent-socket-io-connections
    const socket = io(SOCKET_HOST, {
      upgrade: false,
      transports: ['websocket'],
    });

    // debug stuff
    socket.on('connect_error', (err: any) => {
      console.debug(`connect_error due to ${err.message}`);
    });
    socket.on('connect', (event: any) => {
      console.debug('[ws connect]', event);
    });
    socket.on('connect', (event: any) => {
      console.debug('[ws connect]', event);
    });
    socket.once('connect', () => {
      console.debug('Connected!');
    });
    return socket;
  })();

  return websocketPromise;
};
