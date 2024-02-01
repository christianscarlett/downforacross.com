import {Coord} from '../../shared/types';

interface PlayerState {
  id: string;
  color: string;
  cursorPos: Coord;
  displayName: string;
}

export default PlayerState;
