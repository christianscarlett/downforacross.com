import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import ClueListColumn from './ClueListColumn';
import CluesInfo from '../../lib/Game/CluesInfo';

interface ClueListProps {
  cluesInfo: CluesInfo;
}

function ClueList(props: ClueListProps) {
  const {cluesInfo} = props;
  const [theme] = useTheme();

  const styles = makeStyles(theme);
  return (
    <View style={styles.clueList}>
      <ClueListColumn title="Across" clues={cluesInfo.across} />
      <ClueListColumn title="Down" clues={cluesInfo.down} />
    </View>
  );
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
