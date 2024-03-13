import {createContext} from 'react';

export interface GameContextIntf {
  pencil: boolean;
}

export function getDefaultGameContext(): GameContextIntf {
  return {
    pencil: false,
  };
}

const GameContext = createContext<GameContextIntf>(getDefaultGameContext());

export default GameContext;
