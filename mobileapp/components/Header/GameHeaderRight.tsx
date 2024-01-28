import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageNames from '../../lib/PageNames';
import {useNavigation} from '@react-navigation/native';

function GameHeaderRight() {
  const navigation = useNavigation();
  const styles = makeStyles();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(PageNames.CHAT as never);
      }}
    >
      <Icon name="chat-bubble" style={styles.icon} />
    </TouchableOpacity>
  );
}

const makeStyles = () => {
  return StyleSheet.create({
    icon: {
      fontSize: 20,
      color: 'white',
    },
  });
};

export default GameHeaderRight;
