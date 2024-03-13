import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';

interface GameMenuItemProps {
  title: string;
  onPress: () => void;
}

function GameMenuItem(props: GameMenuItemProps) {
  const {title, onPress} = props;
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.gameMenuItem}>
      <TouchableOpacity style={styles.gameMenuItemTouchable} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    gameMenuItemTouchable: {
      paddingVertical: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gameMenuItem: {
      backgroundColor: theme.colors.background,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    gameMenu: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    },
  });
};

export default GameMenu;
