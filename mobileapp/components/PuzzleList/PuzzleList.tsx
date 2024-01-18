import React, {useState} from 'react';
import PuzzleCard from './PuzzleCard';
import {FlatList, StyleSheet} from 'react-native';
import PuzzleListRepo from '../../lib/Puzzle/PuzzleListRepo';
import Puzzle from '../../lib/Puzzle/Puzzle';

function PuzzleList(): React.JSX.Element {
  let puzzleRepo = PuzzleListRepo.getInstance();
  puzzleRepo.maybeFetchPuzzles(true);

  let [isRefreshing, setIsRefreshing] = useState(false);
  let [puzzles, setPuzzles] = useState<Puzzle[]>(puzzleRepo.getPuzzles());

  return (
    <FlatList
      style={styles.puzzleList}
      data={puzzles}
      renderItem={({item}) => <PuzzleCard puzzle={item} />}
      keyExtractor={puzzle => puzzle.pid}
      onRefresh={async () => {
        setIsRefreshing(true);
        await puzzleRepo.refresh();
        setPuzzles(puzzleRepo.getPuzzles());
        setIsRefreshing(false);
      }}
      refreshing={isRefreshing}
      onEndReached={async () => {
        await puzzleRepo.maybeFetchPuzzles();
        setPuzzles(puzzleRepo.getPuzzles());
      }}
    />
  );
}

const styles = StyleSheet.create({
  puzzleList: {
    padding: 10,
  },
});

export default PuzzleList;
