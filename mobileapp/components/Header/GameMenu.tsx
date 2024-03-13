import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';

interface GameMenuItemProps {
  title: string;
}

function GameMenuItem(props: GameMenuItemProps) {
  const {title} = props;
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.gameMenuItem}>
      <TouchableOpacity
        style={styles.gameMenuItemTouchable}
        onPress={() => {
          console.log('test');
        }}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

function GameMenu() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.gameMenu}>
      <GameMenuItem title="Check" />
      <GameMenuItem title="Reveal" />
      <GameMenuItem title="Reset" />
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    gameMenuItemTouchable: {
      padding: 10,
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
