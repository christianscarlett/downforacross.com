enum Direction {
  DOWN = 'Down',
  ACROSS = 'Across',
}

export function toggleDirection(dir: Direction): Direction {
  if (dir === Direction.DOWN) {
    return Direction.ACROSS;
  }
  return Direction.DOWN;
}

export default Direction;
