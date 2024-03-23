import {WsCell} from './WsCell';
import {WsEvent} from './WsEvent';

export interface WsResetEvent extends WsEvent {
  id: string;
  params: {
    force: boolean;
    scope: WsCell[];
  };
}
