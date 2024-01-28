import {WsCell} from '../Events/WsEventTypes';

interface PlayerState {
  color: string;
  cursorPos: WsCell;
  displayName: string;
}

export default PlayerState;
