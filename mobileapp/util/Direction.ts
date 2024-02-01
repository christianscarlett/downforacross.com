enum Direction {
  DOWN,
  ACROSS,
}

export function toggleDirection(dir: Direction): Direction {
  if (dir === Direction.DOWN) {
    return Direction.ACROSS;
  }
  return Direction.DOWN;
}

export default Direction;
