import {WsEvent} from './WsEvent';

export interface WsUpdateColorEvent extends WsEvent {
  id: string;
  params: {
    color: string;
    id: string;
  };
}
