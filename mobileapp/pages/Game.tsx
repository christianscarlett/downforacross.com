import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../lib/Theme';
import GameManager from '../lib/Game/GameManager';
import GridComponent from '../components/Grid/GridComponent';

// const GAME_URL = 'https://downforacross.com/beta/game/4539636-besp';
const GID = '4539636-besp';

function Game(): React.JSX.Element {
  const [theme] = useTheme();
  const [gid] = useState(GID);
  const [latency, setLatency] = useState<number | null>(null);
  const [gameManager] = useState(() => new GameManager(gid));
  const [grid, setGrid] = useState(gameManager.gameModel.puzzleState.grid);

  useEffect(() => {
    gameManager.reset();

    function onGameModelUpdate() {
      setGrid(gameManager.gameModel.puzzleState.grid);
    }
    gameManager.gameModel.on('update', onGameModelUpdate);

    gameManager.connect();

    function onLatencyUpdate() {
      setLatency(gameManager.gameWsModel.latency);
    }
    gameManager.gameWsModel.on('latencyUpdate', onLatencyUpdate);

    return () => {
      gameManager.disconnect();
      gameManager.gameModel.removeListener('update', onGameModelUpdate);
      gameManager.gameWsModel.removeListener('latencyUpdate', onLatencyUpdate);
    };
  }, [gameManager]);

  const style = makeStyles(theme);
  return (
    <View style={style.game}>
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
