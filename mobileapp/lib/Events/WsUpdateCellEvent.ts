import {WsCell} from './WsCell';
import {WsEvent} from './WsEvent';

export interface WsUpdateCellEvent extends WsEvent {
  id: string;
  params: {
    id: string;
    color: string;
    pencil: boolean;
    value: string;
    cell: WsCell;
  };
}
