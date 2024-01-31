import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PageNames from '../../lib/PageNames';
import PuzzleListItem from '../../lib/PuzzleList/PuzzleListItem';
import {Theme, useTheme} from '../../lib/Theme';

interface PuzzleCardProps {
  puzzle: PuzzleListItem;
}

function PuzzleCard(props: PuzzleCardProps): React.JSX.Element {
  const {puzzle} = props;
  const [theme] = useTheme();
  const navigation = useNavigation();

  let headerText = _.compact([
    puzzle.content.info.author.trim(),
    puzzle.displaySize,
  ]).join(' | ');

  const styles = makeStyles(theme);
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => {
        navigation.navigate(PageNames.GAME as never);
      }}
    >
      <View style={styles.puzzleCard}>
        <Text style={styles.puzzleCardTop}>{headerText}</Text>
        <Text style={styles.puzzleCardMain}>{puzzle.content.info.title}</Text>
        <Text style={styles.puzzleCardDetails}>
          Solved {puzzle.stats.numSolves} times
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: 10,
      borderRadius: 10,
    },
    puzzleCard: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.border,
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
