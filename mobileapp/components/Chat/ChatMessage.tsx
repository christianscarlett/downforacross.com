import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';

export interface ChatMessageProps {
  displayName: string;
  nameColor: string;
  messageText: string;
  time: string;
}

function ChatMessage(props: ChatMessageProps) {
  const {displayName, nameColor, messageText, time} = props;
  const [theme] = useTheme();

  const styles = makeStyles(theme, nameColor);
  return (
    <View style={styles.wrapper}>
      <Text style={styles.name}>{displayName + ':'}</Text>
      <Text>{messageText}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const makeStyles = (theme: Theme, nameColor: string) => {
  return StyleSheet.create({
    name: {
      fontWeight: 'bold',
      color: nameColor,
      marginRight: 5,
    },
    time: {
      marginLeft: 'auto',
      color: theme.colors.textSecondary,
    },
    wrapper: {
      flexDirection: 'row',
      marginVertical: 1,
    },
  });
};

export default ChatMessage;
