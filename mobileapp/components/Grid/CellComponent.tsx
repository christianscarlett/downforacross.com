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
  const {gridEntry, squareSize} = props;
  const [theme] = useTheme();
  const state = useGridEntryState(gridEntry);

  const styles = makeStyles(theme, state, squareSize);
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
      color: state.pencil ? theme.colors.textPencil : theme.colors.textPrimary,
    },
    gridEntry: {
      borderWidth: 0.25,
      borderColor: theme.colors.border,
      backgroundColor: getCellBackgroundColor(state),
      height: squareSize,
      width: squareSize,
      flexGrow: 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    },
  });
};

function getCellBackgroundColor(state: GridEntryState): string {
  if (state.black) {
    return 'black';
  } else if (state.cursors.length !== 0) {
    return state.cursors[0].color;
  }
  return 'white';
}

export default memo(CellComponent);
