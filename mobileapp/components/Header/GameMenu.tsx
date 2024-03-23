import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import GameMenuItem from './GameMenuItem';

interface GameMenuProps {
  onCheckPress: () => void;
}

function GameMenu(props: GameMenuProps) {
  const {onCheckPress} = props;
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.gameMenu}>
      <GameMenuItem title="Check" onPress={onCheckPress} />
      <GameMenuItem title="Reveal" onPress={() => {}} />
      <GameMenuItem title="Reset" onPress={() => {}} />
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    gameMenu: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.mainGray3,
    },
  });
};

export default GameMenu;
