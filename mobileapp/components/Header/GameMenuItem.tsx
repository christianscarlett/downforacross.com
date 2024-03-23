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
        <Text style={styles.gameMenuText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    gameMenuText: {
      color: theme.colors.textSecondary,
    },
    gameMenuItemTouchable: {
      paddingVertical: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gameMenuItem: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
  });
};

export default GameMenuItem;
