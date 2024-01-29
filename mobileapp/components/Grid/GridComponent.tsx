import React from 'react';
import {StyleSheet, View} from 'react-native';
import CellComponent from './CellComponent';
import GridEntry from '../../lib/Puzzle/GridEntry';
import GameManager from '../../lib/Game/GameManager';

const SQUARE_SIZE = 20;

interface RowProps {
  gridEntries: GridEntry[];
  gameManager: GameManager;
}

function Row(props: RowProps) {
  const {gridEntries, gameManager} = props;
  const styles = makeStyles();

  const cells = gridEntries.map((entry, i) => (
    <CellComponent
      key={i}
      gridEntry={entry}
      squareSize={SQUARE_SIZE}
      gameManager={gameManager}
    />
  ));
  return <View style={styles.row}>{cells}</View>;
}

export interface GridComponentProps {
  grid: GridEntry[][];
  gameManager: GameManager;
}

function Col(props: GridComponentProps) {
  const {grid, gameManager} = props;
  const styles = makeStyles();

  const rows = grid.map((entries, i) => (
    <Row key={i} gridEntries={entries} gameManager={gameManager} />
  ));

  return <View style={styles.col}>{rows}</View>;
}

function GridComponent(props: GridComponentProps): React.JSX.Element {
  const styles = makeStyles();

  return (
    <View style={styles.gridContainer}>
      <Col grid={props.grid} gameManager={props.gameManager} />
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
