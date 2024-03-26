import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import ClueListColumn from './ClueListColumn';
import CluesInfo from '../../lib/Game/CluesInfo';
import Direction from '../../util/Direction';

interface ClueListProps {
  cluesInfo: CluesInfo;
  selectedClueIndex: number | null;
  selectedClueDirection: Direction;
  perpendicularClueIndex: number | null;
  onCluePressed: (index: number, direction: Direction) => void;
}

function ClueList(props: ClueListProps) {
  const {
    cluesInfo,
    selectedClueIndex,
    selectedClueDirection,
    perpendicularClueIndex,
    onCluePressed,
  } = props;
  const [theme] = useTheme();

  const columns = [Direction.ACROSS, Direction.DOWN].map(dir => {
    return (
      <ClueListColumn
        title={dir}
        clues={dir === Direction.ACROSS ? cluesInfo.across : cluesInfo.down}
        selectedClueIndex={
          selectedClueDirection === dir ? selectedClueIndex : null
        }
        perpendicularClueIndex={
          selectedClueDirection !== dir ? perpendicularClueIndex : null
        }
        onCluePressed={index => onCluePressed(index, dir)}
      />
    );
  });

  const styles = makeStyles(theme);
  return <View style={styles.clueList}>{columns}</View>;
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    clueList: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.background,
    },
  });
};

export default ClueList;
