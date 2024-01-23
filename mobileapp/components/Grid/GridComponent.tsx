import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {GridEntry} from '../../lib/Puzzle/PuzzleState';
import CellComponent from './Cell';

export interface GridComponentProps {
  grid: GridEntry[][];
}

function GridComponent(props: GridComponentProps): React.JSX.Element {
  const styles = makeStyles();
  return (
    <View style={styles.gridContainer}>
      <FlatList
        style={styles.col}
        data={props.grid}
        contentContainerStyle={styles.contentContainerStyle}
        scrollEnabled={false}
        renderItem={row => (
          <FlatList
            style={styles.row}
            data={row.item}
            contentContainerStyle={styles.contentContainerStyle}
            scrollEnabled={false}
            renderItem={({item}) => <CellComponent gridEntry={item} />}
          />
        )}
      />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    gridContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    col: {
      flexGrow: 0,
    },
    row: {
      flexDirection: 'row',
      flexGrow: 0,
    },
    contentContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default GridComponent;
