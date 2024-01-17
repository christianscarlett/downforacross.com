import React from 'react';
import PuzzleList from '../components/PuzzleList/PuzzleList';
import {StyleSheet, View} from 'react-native';

function Welcome(): React.JSX.Element {
  return (
    <View style={styles.welcome}>
      <PuzzleList />
    </View>
  );
}

const styles = StyleSheet.create({
  welcome: {
    backgroundColor: 'white',
    height: '100%',
  },
});

export default Welcome;
