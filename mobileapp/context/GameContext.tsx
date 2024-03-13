import React, {createContext, useContext, useState} from 'react';

export interface GameContextIntf {
  pencil: boolean;
  setPencil: (pencil: boolean) => void;
}

function getDefaultGameContext(): GameContextIntf {
  return {
    pencil: false,
    setPencil: _ => {},
  };
}

const GameContext = createContext<GameContextIntf>(getDefaultGameContext());

export function GameContextProvider(props: any) {
  const {children} = props;

  const [pencil, setPencil] = useState(false);

  const value: GameContextIntf = {
    pencil,
    setPencil,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGameContext = () => useContext(GameContext);

export default GameContext;
