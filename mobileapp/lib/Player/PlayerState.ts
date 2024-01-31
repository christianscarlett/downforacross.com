interface PlayerState {
  color: string;
  cursorPos: {
    c: number;
    r: number;
  };
  displayName: string;
}

export default PlayerState;
