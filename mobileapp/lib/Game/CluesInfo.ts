import Direction, {toggleDirection} from '../../util/Direction';

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

  getNextClueIndexForceDirection(
    clueIndex: number,
    direction: Direction,
  ): number | null {
    const cluesToScan = this.getClues(direction).slice(clueIndex + 1);
    const nextClueIndex = cluesToScan.findIndex(clue => clue !== null);
    if (nextClueIndex === -1) {
      return null;
    }
    return nextClueIndex;
  }

  /** Gets the index and direction for the next clue. If there is no next clue for a given direction, this will return the first clue index in the other direction. */
  getNextClueIndex(
    clueIndex: number,
    direction: Direction,
  ): [number, Direction] {
    let nextClueIndex = this.getNextClueIndexForceDirection(
      clueIndex,
      direction,
    );
    if (!nextClueIndex) {
      direction = toggleDirection(direction);
      nextClueIndex = this.getClueIndexes(direction)[0];
    }
    if (!nextClueIndex) {
      return [clueIndex, direction];
    }
    return [nextClueIndex, direction];
  }

  /** Returns a list of indexes of non-empty clues for a given direction. */
  getClueIndexes(dir: Direction): number[] {
    const clues = this.getClues(dir);
    return clues.map((_, i) => i).filter(i => clues[i] !== null);
  }
}

export default CluesInfo;
