import React, {useEffect, useState} from 'react';
import GameModel from '../lib/Game/GameModel';
import {Text} from 'react-native';

// const GAME_URL = 'https://downforacross.com/beta/game/4539636-besp';
const GID = '4539636-besp';

function Game(): React.JSX.Element {
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

  return <Text>{'latency: ' + latency}</Text>;
}

export default Game;
