import React, {useEffect, useState} from 'react';
import GameModel from '../lib/Game/GameModel';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../lib/Theme';

// const GAME_URL = 'https://downforacross.com/beta/game/4539636-besp';
const GID = '4539636-besp';

function Game(): React.JSX.Element {
  const [theme] = useTheme();
  const [gid] = useState(GID);
  const [latency, setLatency] = useState(-1);
  const [gameModel] = useState(new GameModel(gid));

  useEffect(() => {
    gameModel.connectToWebsocket();

    gameModel.on('latencyUpdate', () => {
      setLatency(gameModel.latency);
    });

    return () => {
      gameModel.disconnect();
    };
  }, [gameModel]);

  const style = makeStyles(theme);
  return (
    <View style={style.game}>
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
