import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import GridEntry, {GridEntryState} from '../../lib/Puzzle/GridEntry';
import GameManager from '../../lib/Game/GameManager';
import CursorState from '../../lib/Puzzle/CursorState';

export interface CellComponentProps {
  gridEntry: GridEntry;
  squareSize: number;
  gameManager: GameManager;
  gridBorderWidth: number;
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

function getCursorsView(
  cursors: Array<CursorState>,
  squareSize: number,
): React.JSX.Element | null {
  if (cursors.length === 0) {
    return null;
  }
  const cursorViews = getCursorsView(cursors.slice(1), squareSize);

  const cursorState = cursors[0];
  const style = makeCursorStyle(cursorState, squareSize);
  return (
    <View key={cursorState.id} style={style.cursor}>
      {cursorViews}
    </View>
  );
}

function CellComponent(props: CellComponentProps): React.JSX.Element {
  const {gridEntry, squareSize, gridBorderWidth} = props;
  const [theme] = useTheme();
  const state = useGridEntryState(gridEntry);
  const cursorViews = getCursorsView(state.cursors, squareSize);

  const styles = makeStyles(theme, state, squareSize, gridBorderWidth);
  return (
    <View style={styles.gridEntry}>
      {cursorViews}
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

const makeCursorStyle = (cursorState: CursorState, squareSize: number) => {
  return StyleSheet.create({
    cursor: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      borderWidth: squareSize / 20,
      borderColor: cursorState.color,
    },
  });
};

const makeStyles = (
  theme: Theme,
  state: GridEntryState,
  squareSize: number,
  gridBorderWidth: number,
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
      fontSize: squareSize * 0.6,
      marginTop: numberSize,
      alignSelf: 'stretch',
      textAlign: 'center',
      paddingHorizontal: 5,
      color: state.pencil ? theme.colors.textPencil : theme.colors.textPrimary,
    },
    gridEntry: {
      borderWidth: gridBorderWidth,
      borderColor: theme.colors.border,
      backgroundColor: state.black ? 'black' : 'white',
      height: squareSize,
      width: squareSize,
      flexGrow: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default memo(CellComponent);
