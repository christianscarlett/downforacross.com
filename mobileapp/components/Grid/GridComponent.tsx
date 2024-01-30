import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import CellComponent from './CellComponent';
import GridEntry from '../../lib/Puzzle/GridEntry';
import GameManager from '../../lib/Game/GameManager';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {Theme, useTheme} from '../../lib/Theme';

interface RowProps {
  gridEntries: GridEntry[];
  gameManager: GameManager;
  squareSize: number;
  gridBorderWidth: number;
}

function Row(props: RowProps) {
  const {gridEntries, gameManager, squareSize, gridBorderWidth} = props;
  const styles = makeStyles();

  const cells = gridEntries.map((entry, i) => (
    <CellComponent
      key={i}
      gridEntry={entry}
      squareSize={squareSize}
      gameManager={gameManager}
      gridBorderWidth={gridBorderWidth}
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
  const gridBorderWidth = squareSize / 80;

  const rows = grid.map((entries, i) => (
    <Row
      key={i}
      gridEntries={entries}
      gameManager={gameManager}
      squareSize={squareSize}
      gridBorderWidth={gridBorderWidth}
    />
  ));

  const [theme] = useTheme();
  const styles = makeColStyles(theme, gridBorderWidth);
  return <View style={styles.col}>{rows}</View>;
}

const makeColStyles = (theme: Theme, gridBorderWidth: number) =>
  StyleSheet.create({
    col: {
      flexGrow: 0,
      borderWidth: gridBorderWidth,
      borderColor: theme.colors.border,
    },
  });

export interface GridComponentProps {
  grid: GridEntry[][];
  gameManager: GameManager;
}

function GridComponent(props: GridComponentProps): React.JSX.Element {
  const {grid, gameManager} = props;
  const styles = makeStyles();

  if (!grid[0]) {
    return <View style={styles.container} />;
  }

  /**
   * Unfortunately, the components don't update their
   * render with the zoom animation smoothly. Therefore,
   * in order to maintain high fidelity when zooming in,
   * we're going to render the grid at a higher resolution
   * than initially displayed, then scale the grid down
   * as a whole to fit within the zoomable view.
   *
   * Scaling the grid with the zoom props to the zoomable
   * view will cause the zoomable view to render larger
   * than the screen size which will cause snapping issues.
   */

  const quality = 10;
  const zoom = 1 / quality;

  const windowSize = Dimensions.get('window').width;
  const n = grid[0].length;
  const squareSize = windowSize / n;
  const scaledSquareSize = squareSize * quality;

  return (
    <View style={styles.container}>
      <View style={styles.zoomContainer}>
        <ReactNativeZoomableView maxZoom={5} initialZoom={1} minZoom={1}>
          <View style={{transform: [{scale: zoom}]}}>
            <Col
              grid={grid}
              gameManager={gameManager}
              squareSize={scaledSquareSize}
            />
          </View>
        </ReactNativeZoomableView>
      </View>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    zoomContainer: {
      flexShrink: 1,
      width: '100%',
      height: '100%',
    },
    row: {
      flexDirection: 'row',
      flexGrow: 0,
    },
  });

export default GridComponent;
