import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

function PuzzleCard(): React.JSX.Element {
  return (
    <View style={styles.puzzleCard}>
      <Text style={styles.puzzleCardTop}>Will Shortz | Standard</Text>
      <Text style={styles.puzzleCardMain}>
        NY Times, Sunday, January 21, 2024
      </Text>
      <Text style={styles.puzzleCardDetails}>Solved XX times</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  puzzleCard: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'silver',
    marginBottom: 10,
    padding: 20,
    justifyContent: 'space-between',
  },
  puzzleCardTop: {
    marginVertical: 5,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.7)',
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
