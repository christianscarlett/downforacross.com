import {useHeaderHeight} from '@react-navigation/elements';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ClueBar from '../components/Clue/ClueBar';
import {OnCellTap} from '../components/Grid/CellComponent';
import GridComponent from '../components/Grid/GridComponent';
import KeyboardButton from '../components/Grid/KeyboardButton';
import useGameManager from '../lib/Game/useGameManager';
import PlayerState from '../lib/Player/PlayerState';
import {Theme, useTheme} from '../lib/Theme';
import {Coord} from '../shared/types';
import Direction from '../util/Direction';
import {useGameContext} from '../context/GameContext';
import GameMenu from '../components/Header/GameMenu';
import SideMenu from '@chakrahq/react-native-side-menu';

// const GAME_URL = 'https://downforacross.com/beta/game/4539636-besp';
const GID = '4539636-besp';
// mini
// const GID = '4593926-nund';
// sunday
// const GID = '4594515-splob';

function Game(): React.JSX.Element {
  const gameContext = useGameContext();
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
    gameManager.gameModel.getWordScopedCoords(),
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
      setScopedCells(gameManager.gameModel.getWordScopedCoords());
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
    // @ts-ignore
    <SideMenu
      menu={
        <GameMenu
          onClose={() => {
            gameContext.setShowMenu(false);
          }}
          onCheck={scope => {
            gameManager.onCheck(scope);
            gameContext.setShowMenu(false);
          }}
          onReveal={scope => {
            gameManager.onReveal(scope);
            gameContext.setShowMenu(false);
          }}
          onReset={scope => {
            gameManager.onReset(scope);
            gameContext.setShowMenu(false);
          }}
        />
      }
      isOpen={gameContext.showMenu}
      menuPosition="right"
      onChange={isOpen => {
        gameContext.setShowMenu(isOpen);
      }}
    >
      <View style={styles.game}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          keyboardVerticalOffset={headerHeight}
          behavior="padding"
        >
          <Text>{'latency: ' + latency}</Text>
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
              onKeyPress={e => {
                if (e.nativeEvent.key === '.') {
                  gameContext.setPencil(!gameContext.pencil);
                } else {
                  gameManager.onKeyboardInput(
                    e.nativeEvent.key,
                    gameContext.pencil,
                  );
                }
              }}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>
          <ClueBar
            cluesInfo={gameManager.gameModel.cluesInfo}
            clueIndex={clueIndex}
            direction={direction}
            onNextCluePressed={clueIndex => {
              gameManager.selectNextClue(clueIndex);
            }}
          />
        </KeyboardAvoidingView>
      </View>
    </SideMenu>
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
