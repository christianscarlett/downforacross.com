import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useGameContext} from '../../context/GameContext';
import PageNames from '../../lib/PageNames';
import {Theme, useTheme} from '../../lib/Theme';

interface GameHeaderIconProps {
  name: string;
  selected: boolean;
  onPress?: () => void;
}

function GameHeaderIcon(props: GameHeaderIconProps) {
  const {name, selected, onPress} = props;
  const [theme] = useTheme();
  const styles = makeIconStyles(theme, selected);
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={name} style={styles.icon} />
    </TouchableOpacity>
  );
}

const makeIconStyles = (theme: Theme, selected: boolean) => {
  return StyleSheet.create({
    icon: {
      marginLeft: 20,
      fontSize: 20,
      color: selected ? theme.colors.textSecondary : theme.colors.background,
      backgroundColor: selected ? theme.colors.background : 'transparent',
      borderRadius: 5,
      overflow: 'hidden',
      padding: 4,
    },
  });
};

function GameHeaderRight() {
  const gameContext = useGameContext();
  const navigation = useNavigation();
  const styles = makeStyles();
  return (
    <View style={styles.iconRow}>
      <GameHeaderIcon
        name="drive-file-rename-outline"
        selected={gameContext.pencil}
        onPress={() => {
          gameContext.setPencil(!gameContext.pencil);
        }}
      />
      <GameHeaderIcon
        name="chat-bubble"
        selected={false}
        onPress={() => {
          navigation.navigate(PageNames.CHAT as never);
        }}
      />
      <GameHeaderIcon
        name="menu"
        selected={gameContext.showMenu}
        onPress={() => {
          gameContext.setShowMenu(!gameContext.showMenu);
        }}
      />
    </View>
  );
}

const makeStyles = () => {
  return StyleSheet.create({
    iconRow: {
      flexDirection: 'row',
    },
  });
};

export default GameHeaderRight;
