import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import GridEntry, {GridEntryState} from '../../lib/Puzzle/GridEntry';
import GameManager from '../../lib/Game/GameManager';

export interface CellComponentProps {
  gridEntry: GridEntry;
  squareSize: number;
  gameManager: GameManager;
}

function useGridEntryState(gridEntry: GridEntry): GridEntryState {
  const [state, setState] = useState(gridEntry.getState());

  useEffect(() => {
    function gridEntryListener() {
      setState(gridEntry.getState());
    }
    gridEntry.on('update', gridEntryListener);
    return () => {
      gridEntry.removeListener('update', gridEntryListener);
    };
  }, [gridEntry]);

  return state;
}

function CellComponent(props: CellComponentProps): React.JSX.Element {
  const {gridEntry, squareSize, gameManager} = props;
  const [theme] = useTheme();
  const state = useGridEntryState(gridEntry);

  const styles = makeStyles(theme, state, squareSize, gameManager);
  return (
    <View style={styles.gridEntry}>
      <Text style={styles.gridEntryNumber}>{state.number}</Text>
      <Text
        style={styles.gridEntryValue}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
      >
        {state.value}
      </Text>
    </View>
  );
}

const makeStyles = (
  theme: Theme,
  state: GridEntryState,
  squareSize: number,
  gameManager: GameManager,
) => {
  let numberPadding = squareSize / 10;
  let numberSize = squareSize / 5;
  return StyleSheet.create({
    gridEntryNumber: {
      position: 'absolute',
      top: numberPadding,
      left: numberPadding,
      fontSize: numberSize,
      height: numberSize,
      color: theme.colors.textSecondary,
    },
    gridEntryValue: {
      fontSize: squareSize * 0.7,
      marginTop: numberSize,
      alignSelf: 'stretch',
      textAlign: 'center',
      paddingHorizontal: 5,
    },
    gridEntry: {
      borderWidth: 0.25,
      borderColor: theme.colors.border,
      backgroundColor: getCellBackgroundColor(theme, state, gameManager),
      height: squareSize,
      width: squareSize,
      flexGrow: 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    },
  });
};

function getCellBackgroundColor(
  theme: Theme,
  state: GridEntryState,
  gameManager: GameManager,
): string {
  if (state.black) {
    return 'black';
  } else if (state.cursorIds.length !== 0) {
    console.log(
      gameManager.gameModel.playerStateManager.getState(state.cursorIds[0]),
    );
    return (
      gameManager.gameModel.playerStateManager.getState(state.cursorIds[0])
        ?.color ?? theme.colors.primary
    );
  }
  return 'white';
}

export default memo(CellComponent);
