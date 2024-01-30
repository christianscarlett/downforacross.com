import React from 'react';
import {StyleSheet, View} from 'react-native';
import CellComponent from './CellComponent';
import GridEntry from '../../lib/Puzzle/GridEntry';
import GameManager from '../../lib/Game/GameManager';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface RowProps {
  gridEntries: GridEntry[];
  gameManager: GameManager;
  squareSize: number;
}

function Row(props: RowProps) {
  const {gridEntries, gameManager, squareSize} = props;
  const styles = makeStyles();

  const cells = gridEntries.map((entry, i) => (
    <CellComponent
      key={i}
      gridEntry={entry}
      squareSize={squareSize}
      gameManager={gameManager}
    />
  ));
  return <View style={styles.row}>{cells}</View>;
}

interface ColProps {
  grid: GridEntry[][];
  gameManager: GameManager;
  squareSize: number;
}

function Col(props: ColProps) {
  const {grid, gameManager, squareSize} = props;
  const styles = makeStyles();

  const rows = grid.map((entries, i) => (
    <Row
      key={i}
      gridEntries={entries}
      gameManager={gameManager}
      squareSize={squareSize}
    />
  ));

  return <View style={styles.col}>{rows}</View>;
}

export interface GridComponentProps {
  grid: GridEntry[][];
  gameManager: GameManager;
}

function GridComponent(props: GridComponentProps): React.JSX.Element {
  const squareSize = 20;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const styles = makeStyles();
  return (
    <GestureDetector gesture={pinchGesture}>
      <View style={styles.gridContainer}>
        <Animated.View style={animatedStyle}>
          <Col
            grid={props.grid}
            gameManager={props.gameManager}
            squareSize={squareSize}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    gridContainer: {
      overflow: 'hidden',
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
  });

export default GridComponent;
