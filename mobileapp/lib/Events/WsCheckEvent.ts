import {WsCell} from './WsCell';
import {WsEvent} from './WsEvent';

export interface WsCheckEvent extends WsEvent {
  id: string;
  params: {
    scope: WsCell[];
  };
}
