import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {GridEntry} from '../../lib/Puzzle/PuzzleState';
import CellComponent from './CellComponent';

export interface GridComponentProps {
  grid: GridEntry[][];
}

// See https://stackoverflow.com/questions/44384773/react-native-100-items-flatlist-very-slow-performance for perf optimizations

function renderRow(row: {item: GridEntry[]}) {
  const styles = makeStyles();
  return (
    <FlatList
      style={styles.row}
      data={row.item}
      contentContainerStyle={styles.contentContainerStyle}
      scrollEnabled={false}
      initialNumToRender={row.item.length}
      renderItem={({item}) => <CellComponent gridEntry={item} />}
    />
  );
}

function renderGrid(props: GridComponentProps) {
  const {grid} = props;
  const styles = makeStyles();
  return (
    <FlatList
      style={styles.col}
      data={props.grid}
      contentContainerStyle={styles.contentContainerStyle}
      scrollEnabled={false}
      initialNumToRender={grid.length}
      renderItem={renderRow}
    />
  );
}

function GridComponent(props: GridComponentProps): React.JSX.Element {
  const styles = makeStyles();
  return <View style={styles.gridContainer}>{renderGrid(props)}</View>;
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
