import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import _ from 'lodash';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PlayerState from '../../lib/Player/PlayerState';
import GridEntry from '../../lib/Puzzle/GridEntry';
import {Theme, useTheme} from '../../lib/Theme';
import {Coord} from '../../shared/types';
import Direction from '../../util/Direction';
import MemoCellComponent, {OnCellTap} from './CellComponent';
import KeyboardButton from './KeyboardButton';

interface RowProps {
  gridEntries: GridEntry[];
  squareSize: number;
  gridBorderWidth: number;
  playerStates: PlayerState[];
  userState: PlayerState;
  direction: Direction;
  scopedCells: Coord[];
  onCellTap: OnCellTap;
}

function Row(props: RowProps) {
  const {
    gridEntries,
    squareSize,
    gridBorderWidth,
    playerStates,
    userState,
    scopedCells,
    onCellTap,
  } = props;
  const styles = makeStyles();

  const cells = gridEntries.map((entry, i) => (
    <MemoCellComponent
      key={i}
      gridEntryState={entry.state}
      squareSize={squareSize}
      gridBorderWidth={gridBorderWidth}
      cursors={playerStates.filter(playerState =>
        _.isEqual(playerState.cursorPos, entry.state.cell),
      )}
      userCursor={
        _.isEqual(userState.cursorPos, entry.state.cell) ? userState : null
      }
      isScoped={scopedCells.some(coord => _.isEqual(coord, entry.state.cell))}
      onTap={onCellTap}
    />
  ));
  return <View style={styles.row}>{cells}</View>;
}

interface ColProps {
  grid: GridEntry[][];
  squareSize: number;
  playerStates: PlayerState[];
  userState: PlayerState;
  direction: Direction;
  scopedCells: Coord[];
  onCellTap: OnCellTap;
}

function Col(props: ColProps) {
  const {
    grid,
    squareSize,
    playerStates,
    userState,
    direction,
    scopedCells,
    onCellTap,
  } = props;
  const gridBorderWidth = squareSize / 80;

  const rows = grid.map((entries, i) => (
    <Row
      key={i}
      gridEntries={entries}
      squareSize={squareSize}
      gridBorderWidth={gridBorderWidth}
      playerStates={playerStates}
      userState={userState}
      direction={direction}
      scopedCells={scopedCells}
      onCellTap={onCellTap}
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
  playerStates: PlayerState[];
  userState: PlayerState;
  direction: Direction;
  scopedCells: Coord[];
  onCellTap: OnCellTap;
}

function getSquareSize(numSquares: number, viewLength: number) {
  return viewLength / numSquares;
}

function GridComponent(props: GridComponentProps): React.JSX.Element {
  const {
    grid,
    playerStates,
    userState,
    direction,
    scopedCells,
    onCellTap,
  } = props;

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

  const [viewWidth, setViewWidth] = useState(1);
  const [viewHeight, setViewHeight] = useState(1);

  const quality = 10;
  const scale = 1 / quality;

  // Ensure grid can fit on screen
  const squareSize = Math.min(
    getSquareSize(grid.length, viewHeight),
    getSquareSize(grid[0].length, viewWidth),
  );

  const scaledSquareSize = squareSize * quality;

  const styles = makeStyles();
  return (
    <View
      style={styles.container}
      onLayout={e => {
        const {width, height} = e.nativeEvent.layout;
        setViewWidth(width);
        setViewHeight(height);
      }}
    >
      <View style={styles.zoomContainer}>
        <ReactNativeZoomableView maxZoom={5} initialZoom={1} minZoom={1}>
          <View style={{transform: [{scale: scale}]}}>
            <Col
              grid={grid}
              squareSize={scaledSquareSize}
              playerStates={playerStates}
              userState={userState}
              direction={direction}
              scopedCells={scopedCells}
              onCellTap={onCellTap}
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
