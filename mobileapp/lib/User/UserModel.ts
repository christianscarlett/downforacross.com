import _ from 'lodash';
import PlayerState from '../Player/PlayerState';

/** Object to keep track of the user's state */
class UserModel {
  state: PlayerState = {
    id: '0',
    color: 'lightgreen',
    cursorPos: {
      r: 0,
      c: 0,
    },
    displayName: 'user',
  };

  update(newState: Partial<PlayerState>) {
    this.state = _.cloneDeep({...this.state, ...newState});
  }
}

export default UserModel;
