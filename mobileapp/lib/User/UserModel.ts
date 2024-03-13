import _ from 'lodash';
import Direction, {toggleDirection} from '../../util/Direction';
import PlayerState from '../Player/PlayerState';

export interface UserState {
  id: string;
  direction: Direction;
  playerState: PlayerState;
}

/** Object to keep track of the user's state */
class UserModel {
  state: UserState = {
    id: 'test_id',
    direction: Direction.ACROSS,
    playerState: {
      id: '0',
      color: '#90EE90',
      cursorPos: {
        r: 0,
        c: 0,
      },
      displayName: 'test name',
    },
  };

  get direction(): Direction {
    return this.state.direction;
  }

  get playerState(): PlayerState {
    return this.state.playerState;
  }

  toggleDirection() {
    this.update({
      direction: toggleDirection(this.state.direction),
    });
  }

  update(newState: Partial<UserState>) {
    this.state = _.cloneDeep({...this.state, ...newState});
  }
}

export default UserModel;
