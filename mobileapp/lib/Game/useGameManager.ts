import {createContext, useContext} from 'react';
import GameManager from './GameManager';

interface GameManagerContext {
  gameManager: GameManager;
}

const gameManager: GameManager = new GameManager();

const gameManagerContext = createContext<GameManagerContext>({
  gameManager,
});

function useGameManager(): GameManager {
  const context = useContext(gameManagerContext);
  return context.gameManager;
}

export default useGameManager;
