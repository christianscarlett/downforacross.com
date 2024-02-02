import Direction from '../../util/Direction';

class CluesInfo {
  across: Array<string | null>;
  down: Array<string | null>;

  constructor(across: Array<string | null>, down: Array<string | null>) {
    this.across = [...across];
    this.down = [...down];
  }

  getClues(direction: Direction): Array<string | null> {
    switch (direction) {
      case Direction.DOWN:
        return this.down;
      case Direction.ACROSS:
        return this.across;
    }
  }
}

export default CluesInfo;
