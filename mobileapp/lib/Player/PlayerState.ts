interface PlayerState {
  id: string;
  color: string;
  cursorPos: {
    c: number;
    r: number;
  };
  displayName: string;
}

export default PlayerState;
