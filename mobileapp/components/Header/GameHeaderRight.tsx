import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useGameContext} from '../../context/GameContext';
import PageNames from '../../lib/PageNames';
import {Theme, useTheme} from '../../lib/Theme';

function GameHeaderRight() {
  const gameContext = useGameContext();
  const navigation = useNavigation();
  const [theme] = useTheme();
  const styles = makeStyles();
  return (
    <View style={styles.iconRow}>
      <TouchableOpacity
        onPress={() => {
          gameContext.setPencil(!gameContext.pencil);
        }}
      >
        <Icon
          name="drive-file-rename-outline"
          style={makeIconStyle(theme, gameContext.pencil).icon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(PageNames.CHAT as never);
        }}
      >
        <Icon name="chat-bubble" style={makeIconStyle(theme, false).icon} />
      </TouchableOpacity>
    </View>
  );
}

const makeIconStyle = (theme: Theme, selected: boolean) => {
  return StyleSheet.create({
    icon: {
      marginLeft: 15,
      fontSize: 25,
      color: selected ? theme.colors.textSecondary : 'white',
    },
  });
};

const makeStyles = () => {
  return StyleSheet.create({
    iconRow: {
      flexDirection: 'row',
    },
  });
};

export default GameHeaderRight;
