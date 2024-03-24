import React, {createContext, useContext, useState} from 'react';
import GameMenuPage from './GameMenuPage';

export interface GameContextIntf {
  pencil: boolean;
  setPencil: (_: boolean) => void;
  menuPage: GameMenuPage | null;
  setMenuPage: (_: GameMenuPage | null) => void;
}

function getDefaultGameContext(): GameContextIntf {
  return {
    pencil: false,
    setPencil: _ => {},
    menuPage: null,
    setMenuPage: _ => {},
  };
}

const GameContext = createContext<GameContextIntf>(getDefaultGameContext());

export function GameContextProvider(props: any) {
  const {children} = props;

  const [pencil, setPencil] = useState(false);
  const [menuPage, setMenuPage] = useState<GameMenuPage | null>(null);

  const value: GameContextIntf = {
    pencil,
    setPencil,
    menuPage,
    setMenuPage,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGameContext = () => useContext(GameContext);

export default GameContext;
