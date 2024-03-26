import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import ClueItem from './ClueItem';

interface ClueColumnProps {
  title: string;
  clues: Array<string | null>;
}

interface ClueListItemData {
  index: number;
  text: string;
}

function ClueListColumn(props: ClueColumnProps) {
  const {title, clues} = props;
  const [theme] = useTheme();

  const cluesData: ClueListItemData[] = [];
  clues.forEach((clue, i) => {
    if (clue !== null) {
      cluesData.push({
        index: i,
        text: clue,
      });
    }
  });

  function renderClueItem(data: ClueListItemData) {
    const {index, text} = data;
    return <ClueItem index={index} text={text} />;
  }

  const styles = makeStyles(theme);
  return (
    <View style={styles.column}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={cluesData}
        renderItem={({item}) => renderClueItem(item)}
        keyExtractor={item => item.index.toString()}
      />
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    title: {
      marginVertical: 5,
      color: theme.colors.textPrimary,
      fontWeight: 'bold',
    },
    column: {
      borderLeftWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 4,
      flex: 1,
    },
  });
};

export default ClueListColumn;
