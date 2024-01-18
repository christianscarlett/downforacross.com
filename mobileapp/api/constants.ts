const REACT_APP_USE_LOCAL_SERVER = false;

const REMOTE_SERVER = 'api.foracross.com';

const REMOTE_SERVER_URL = `https://${REMOTE_SERVER}`;

export const SERVER_URL = REACT_APP_USE_LOCAL_SERVER
  ? 'http://localhost:3021'
  : REMOTE_SERVER_URL;

// socket.io server is same as api server
export const SOCKET_HOST = SERVER_URL;
