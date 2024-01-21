import React, {useEffect, useState} from 'react';
import PuzzleCard from './PuzzleCard';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import PuzzleListRepo from '../../lib/PuzzleList/PuzzleListRepo';
import Puzzle from '../../lib/PuzzleList/PuzzleListItem';

function PuzzleList(): React.JSX.Element {
  let puzzleRepo = PuzzleListRepo.getInstance();

  let [isRefreshing, setIsRefreshing] = useState(false);
  let [puzzles, setPuzzles] = useState<Puzzle[]>(puzzleRepo.getPuzzles());

  useEffect(() => {
    async function initialFetch() {
      await puzzleRepo.maybeFetchPuzzles(true);
      setPuzzles(puzzleRepo.getPuzzles());
    }
    initialFetch();
  }, [setPuzzles, puzzleRepo]);

  return (
    <>
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
        ListFooterComponent={
          <ActivityIndicator style={styles.puzzleFooter} size="large" />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  puzzleList: {
    padding: 10,
  },
  puzzleFooter: {
    marginBottom: 20,
  },
});

export default PuzzleList;
