import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../lib/Theme';
import GridComponent from '../components/Grid/GridComponent';
import ClueHeader from '../components/Clue/ClueHeader';
import useGameManager from '../lib/Game/useGameManager';
import CursorState from '../lib/Puzzle/CursorState';
import PlayerState from '../lib/Player/PlayerState';

// const GAME_URL = 'https://downforacross.com/beta/game/4539636-besp';
const GID = '4539636-besp';
// mini
// const GID = '4593926-nund';
// sunday
// const GID = '4594515-splob';

function Game(): React.JSX.Element {
  const [theme] = useTheme();
  const [gid] = useState(GID);
  const [latency, setLatency] = useState<number | null>(null);
  const gameManager = useGameManager();
  const [grid, setGrid] = useState(gameManager.gameModel.puzzleModel.grid);
  const [playerStates, setPlayerStates] = useState<PlayerState[]>(
    gameManager.gameModel.playerModel.getAllStates(),
  );

  useEffect(() => {
    function onGameModelUpdate() {
      setGrid(gameManager.gameModel.puzzleModel.grid);
      setPlayerStates(gameManager.gameModel.playerModel.getAllStates());
    }
    function onLatencyUpdate() {
      setLatency(gameManager.wsModel.latency);
    }

    async function init() {
      gameManager.init(gid);
      gameManager.on('gameModelUpdate', onGameModelUpdate);
      gameManager.connect();
      gameManager.wsModel.on('latencyUpdate', onLatencyUpdate);
    }
    init();

    return () => {
      gameManager.disconnect();
      gameManager.removeListener('gameModelUpdate', onGameModelUpdate);
      gameManager.wsModel.removeListener('latencyUpdate', onLatencyUpdate);
    };
  }, [gameManager, gid]);

  const style = makeStyles(theme);
  return (
    <View style={style.game}>
      <ClueHeader />
      <GridComponent
        grid={grid}
        gameManager={gameManager}
        playerStates={playerStates}
      />
      <Text>{'latency: ' + latency}</Text>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    game: {
      backgroundColor: theme.colors.background,
      height: '100%',
    },
  });

export default Game;
