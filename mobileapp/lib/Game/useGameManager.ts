import {useState} from 'react';
import GameManager from './GameManager';

function useGameManager(): GameManager {
  const [gameManager] = useState(() => new GameManager());
  return gameManager;
}

export default useGameManager;
