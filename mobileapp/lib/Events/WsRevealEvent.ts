import {WsCell} from './WsCell';
import {WsEvent} from './WsEvent';

export interface WsRevealEvent extends WsEvent {
  id: string;
  params: {
    scope: WsCell[];
  };
}
