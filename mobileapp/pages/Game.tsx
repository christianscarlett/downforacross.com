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
  const [latency, setLatency] = useState(-1);
  const [gameManager] = useState(() => new GameManager(gid));
  const [grid, setGrid] = useState(gameManager.gameModel.puzzleState.grid);

  useEffect(() => {
    gameManager.reset();
    gameManager.gameModel.on('update', () => {
      setGrid(gameManager.gameModel.puzzleState.grid);
    });

    gameManager.connect();
    gameManager.gameWsModel.on('latencyUpdate', () => {
      setLatency(gameManager.gameWsModel.latency);
    });

    return () => {
      gameManager.disconnect();
    };
  }, [gameManager]);

  const style = makeStyles(theme);
  return (
    <View style={style.game}>
      <GridComponent grid={grid} />
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
