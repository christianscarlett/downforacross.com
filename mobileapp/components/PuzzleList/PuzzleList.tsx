import React from 'react';
import PuzzleCard from './PuzzleCard';
import {ScrollView, StyleSheet} from 'react-native';

function PuzzleList(): React.JSX.Element {
  return (
    <ScrollView style={styles.puzzleList}>
      <PuzzleCard />
      <PuzzleCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  puzzleList: {
    padding: 10,
  },
});

export default PuzzleList;
