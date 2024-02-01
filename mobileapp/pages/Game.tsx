import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ClueHeader from '../components/Clue/ClueHeader';
import {OnCellTap} from '../components/Grid/CellComponent';
import GridComponent from '../components/Grid/GridComponent';
import useGameManager from '../lib/Game/useGameManager';
import PlayerState from '../lib/Player/PlayerState';
import {Theme, useTheme} from '../lib/Theme';
import {Coord} from '../shared/types';
import Direction from '../util/Direction';

// const GAME_URL = 'https://downforacross.com/beta/game/4539636-besp';
const GID = '4539636-besp';
// mini
// const GID = '4593926-nund';
// sunday
// const GID = '4594515-splob';

function Game(): React.JSX.Element {
  const gameManager = useGameManager();
  const [theme] = useTheme();
  const [gid] = useState(GID);
  const [latency, setLatency] = useState<number | null>(null);
  const [grid, setGrid] = useState(gameManager.gameModel.puzzleModel.grid);
  const [playerStates, setPlayerStates] = useState<PlayerState[]>(
    gameManager.gameModel.playerModel.getAllStates(),
  );
  const [userState, setUserState] = useState<PlayerState>(
    gameManager.gameModel.userModel.playerState,
  );
  const [direction, setDirection] = useState<Direction>(Direction.ACROSS);

  const onCellTap = useMemo<OnCellTap>(
    () => (cell: Coord) => {
      gameManager.gameModel.onCellTap(cell);
    },
    [gameManager],
  );

  useEffect(() => {
    function onGameModelUpdate() {
      setGrid(gameManager.gameModel.puzzleModel.grid);
      setPlayerStates(gameManager.gameModel.playerModel.getAllStates());
      setUserState({...gameManager.gameModel.userModel.playerState});
      setDirection(gameManager.gameModel.userModel.direction);
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
      <ClueHeader
        clues={gameManager.gameModel.clues}
        clueIndex={1}
        direction={direction}
      />
      <GridComponent
        grid={grid}
        playerStates={playerStates}
        userState={userState}
        direction={direction}
        onCellTap={onCellTap}
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
