import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PuzzleInfo from '../../lib/Puzzle/PuzzleInfo';
import {Theme, useTheme} from '../../lib/Theme';

export interface PuzzleInfoHeaderProps {
  puzzleInfo: PuzzleInfo;
}

function PuzzleInfoHeader(props: PuzzleInfoHeaderProps) {
  const {puzzleInfo} = props;
  const [theme] = useTheme();

  const styles = makeStyles(theme);
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{puzzleInfo.title}</Text>
      {puzzleInfo.description && (
        <Text style={styles.description}>{puzzleInfo.description} asdf</Text>
      )}
      {(puzzleInfo.type || puzzleInfo.author) && (
        <Text style={styles.author}>
          {puzzleInfo.type && `${puzzleInfo.type} | `}
          {puzzleInfo.author && `By ${puzzleInfo.author}`}
        </Text>
      )}
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    author: {
      fontWeight: '500',
    },
    description: {
      color: theme.colors.textSecondary,
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: '500',
      marginBottom: 10,
    },
    header: {
      width: '100%',
      padding: 10,
    },
  });
};

export default PuzzleInfoHeader;
