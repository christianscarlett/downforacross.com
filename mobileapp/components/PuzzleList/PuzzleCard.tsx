import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Puzzle from '../../lib/Puzzle/Puzzle';
import {Theme, useTheme} from '../../lib/Theme';

interface PuzzleCardProps {
  puzzle: Puzzle;
}

function PuzzleCard(props: PuzzleCardProps): React.JSX.Element {
  const {puzzle} = props;
  const [theme] = useTheme();

  let headerText = _.compact([
    puzzle.content.info.author.trim(),
    puzzle.displaySize,
  ]).join(' | ');

  const styles = makeStyles(theme);
  return (
    <View style={styles.puzzleCard}>
      <Text style={styles.puzzleCardTop}>{headerText}</Text>
      <Text style={styles.puzzleCardMain}>{puzzle.content.info.title}</Text>
      <Text style={styles.puzzleCardDetails}>
        Solved {puzzle.stats.numSolves} times
      </Text>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    puzzleCard: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.border,
      marginBottom: 10,
      padding: 20,
      justifyContent: 'space-between',
    },
    puzzleCardTop: {
      marginVertical: 5,
      fontWeight: '400',
      color: theme.colors.textSecondary,
    },
    puzzleCardMain: {
      marginVertical: 5,
    },
    puzzleCardDetails: {
      marginVertical: 5,
      fontSize: 10,
    },
  });

export default PuzzleCard;
