import {WsEvent} from './WsEvent';

export interface WsChatEvent extends WsEvent {
  id: string;
  params: {
    sender: string;
    senderId: string;
    text: string;
  };
}
