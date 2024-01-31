import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../lib/Theme';
import GridComponent from '../components/Grid/GridComponent';
import ClueHeader from '../components/Clue/ClueHeader';
import useGameManager from '../lib/Game/useGameManager';

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

  useEffect(() => {
    gameManager.init(gid);

    function onGameModelUpdate() {
      setGrid(gameManager.gameModel.puzzleModel.grid);
    }
    gameManager.gameModel.on('update', onGameModelUpdate);

    gameManager.connect();

    function onLatencyUpdate() {
      setLatency(gameManager.wsModel.latency);
    }
    gameManager.wsModel.on('latencyUpdate', onLatencyUpdate);

    return () => {
      gameManager.disconnect();
      gameManager.gameModel.removeListener('update', onGameModelUpdate);
      gameManager.wsModel.removeListener('latencyUpdate', onLatencyUpdate);
    };
  }, [gameManager, gid]);

  const style = makeStyles(theme);
  return (
    <View style={style.game}>
      <ClueHeader />
      <GridComponent grid={grid} gameManager={gameManager} />
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
