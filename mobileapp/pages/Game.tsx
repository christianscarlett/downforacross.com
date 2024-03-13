import {useHeaderHeight} from '@react-navigation/elements';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ClueHeader from '../components/Clue/ClueHeader';
import {OnCellTap} from '../components/Grid/CellComponent';
import GridComponent from '../components/Grid/GridComponent';
import KeyboardButton from '../components/Grid/KeyboardButton';
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
  const [clueIndex, setClueIndex] = useState(
    gameManager.gameModel.getSelectedClueIndex(),
  );
  const [scopedCells, setScopedCells] = useState(
    gameManager.gameModel.getScopedCells(),
  );

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
      setClueIndex(gameManager.gameModel.getSelectedClueIndex());
      setScopedCells(gameManager.gameModel.getScopedCells());
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

  const textInputRef = useRef<TextInput | null>(null);

  const headerHeight = useHeaderHeight();
  const styles = makeStyles(theme);
  return (
    <View style={styles.game}>
      <ClueHeader
        cluesInfo={gameManager.gameModel.cluesInfo}
        clueIndex={clueIndex}
        direction={direction}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={headerHeight}
        behavior="padding"
      >
        <View style={styles.gridWrapper}>
          {grid[0] && (
            <GridComponent
              grid={grid}
              playerStates={playerStates}
              userState={userState}
              direction={direction}
              scopedCells={scopedCells}
              onCellTap={onCellTap}
            />
          )}
          <KeyboardButton textInputRef={textInputRef} />
          <TextInput
            style={styles.textInput}
            ref={textInputRef}
            onKeyPress={e => gameManager.onKeyboardInput(e.nativeEvent.key)}
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
      </KeyboardAvoidingView>
      <Text>{'latency: ' + latency}</Text>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    textInput: {
      display: 'none',
    },
    gridWrapper: {
      flexGrow: 1,
    },
    keyboardAvoiding: {
      flexGrow: 1,
    },
    game: {
      backgroundColor: theme.colors.background,
      height: '100%',
    },
  });

export default Game;
