import React from 'react';
import PuzzleList from '../components/PuzzleList/PuzzleList';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../lib/Theme';

function Welcome(): React.JSX.Element {
  const [theme] = useTheme();

  const styles = makeStyles(theme);
  return (
    <View style={styles.welcome}>
      <PuzzleList />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    welcome: {
      backgroundColor: theme.colors.background,
      height: '100%',
    },
  });

export default Welcome;
