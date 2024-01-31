import {WsEvent} from './WsEvent';

export interface WsUpdateDisplayNameEvent extends WsEvent {
  id: string;
  params: {
    displayName: string;
    id: string;
  };
}
