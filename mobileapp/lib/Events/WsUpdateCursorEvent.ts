import {WsCell} from './WsCell';
import {WsEvent} from './WsEvent';

export interface WsUpdateCursorEvent extends WsEvent {
  id: string;
  params: {
    cell: WsCell;
    id: string;
    timestamp: number;
  };
}
