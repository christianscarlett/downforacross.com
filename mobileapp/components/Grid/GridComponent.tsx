import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import CellComponent from './CellComponent';
import GridEntry from '../../lib/Puzzle/GridEntry';
import GameManager from '../../lib/Game/GameManager';

export interface GridComponentProps {
  grid: GridEntry[][];
  gameManager: GameManager;
}

// See https://stackoverflow.com/questions/44384773/react-native-100-items-flatlist-very-slow-performance for perf optimizations

const SQUARE_SIZE = 20;

interface RowItem {
  gridEntries: GridEntry[];
  gameManager: GameManager;
}

function renderRow(row: {item: RowItem}) {
  const {gridEntries, gameManager} = row.item;
  const styles = makeStyles();
  return (
    <FlatList
      style={styles.row}
      data={gridEntries}
      contentContainerStyle={styles.contentContainerStyle}
      scrollEnabled={false}
      initialNumToRender={gridEntries.length}
      getItemLayout={(data, index) => ({
        length: SQUARE_SIZE,
        offset: SQUARE_SIZE * index,
        index,
      })}
      renderItem={({item}) => (
        <CellComponent
          gridEntry={item}
          squareSize={SQUARE_SIZE}
          gameManager={gameManager}
        />
      )}
    />
  );
}

function renderGrid(props: GridComponentProps) {
  const {grid, gameManager} = props;
  const styles = makeStyles();

  const rowItems = grid.map(gridEntries => {
    return {
      gridEntries,
      gameManager,
    };
  });
  return (
    <FlatList
      style={styles.col}
      data={rowItems}
      contentContainerStyle={styles.contentContainerStyle}
      scrollEnabled={false}
      initialNumToRender={grid.length}
      getItemLayout={(data, index) => ({
        length: SQUARE_SIZE,
        offset: SQUARE_SIZE * index,
        index,
      })}
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
