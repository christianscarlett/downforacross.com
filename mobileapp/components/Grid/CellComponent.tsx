import _ from 'lodash';
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PlayerState from '../../lib/Player/PlayerState';
import {GridEntryState} from '../../lib/Puzzle/GridEntry';
import {Theme, useTheme} from '../../lib/Theme';

export interface CellComponentProps {
  gridEntryState: GridEntryState;
  squareSize: number;
  gridBorderWidth: number;
  cursors: PlayerState[];
}

function getCursorsView(
  cursors: PlayerState[],
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
  const {gridEntryState, squareSize, gridBorderWidth, cursors} = props;
  const [theme] = useTheme();
  const cursorViews = getCursorsView(cursors, squareSize);

  const styles = makeStyles(theme, gridEntryState, squareSize, gridBorderWidth);
  return (
    <View style={styles.gridEntry}>
      {cursorViews}
      <Text style={styles.gridEntryNumber}>{gridEntryState.number}</Text>
      <Text
        style={styles.gridEntryValue}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
      >
        {gridEntryState.value}
      </Text>
    </View>
  );
}

const makeCursorStyle = (cursorState: PlayerState, squareSize: number) => {
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

function arePropsEqual(
  oldProps: CellComponentProps,
  newProps: CellComponentProps,
): boolean {
  return _.isEqual(oldProps, newProps);
}

const MemoCellComponent = memo(CellComponent, arePropsEqual);

export default MemoCellComponent;
