import React from 'react';
import {GridEntry} from '../../lib/Puzzle/PuzzleState';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';

export interface CellComponentProps {
  gridEntry: GridEntry;
}

const SQUARE_SIZE = 20;

function CellComponent(props: CellComponentProps): React.JSX.Element {
  const {gridEntry} = props;
  const [theme] = useTheme();

  const styles = makeStyles(theme, gridEntry.black, SQUARE_SIZE);
  return (
    <View style={styles.gridEntry}>
      <Text style={styles.gridEntryNumber}>{gridEntry.number}</Text>
      <Text
        style={styles.gridEntryValue}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
      >
        {gridEntry.value}
      </Text>
    </View>
  );
}

const makeStyles = (theme: Theme, black: boolean, squareSize: number) => {
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
      backgroundColor: black ? 'black' : 'white',
      height: squareSize,
      width: squareSize,
      flexGrow: 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    },
  });
};

export default CellComponent;
