import EventEmitter from 'events';
import {WsCell} from '../Events/WsEventTypes';

class Cursor extends EventEmitter {
  id: string;
  cell: WsCell;

  constructor(id: string, cell: WsCell) {
    super();
    this.id = id;
    this.cell = cell;
  }

  emitUpdate() {
    this.emit('update');
  }
}

export default Cursor;
