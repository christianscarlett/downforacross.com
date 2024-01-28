import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import {format} from 'date-fns';

export interface ChatMessageProps {
  displayName: string;
  nameColor: string;
  messageText: string;
  time: number;
}

function ChatMessage(props: ChatMessageProps) {
  const {displayName, nameColor, messageText, time} = props;
  const [theme] = useTheme();

  const formattedTime = format(new Date(time), 'h:mm a');

  const styles = makeStyles(theme, nameColor);
  return (
    <View style={styles.wrapper}>
      <Text style={styles.message}>
        <Text style={styles.name}>{`${displayName}: `}</Text>
        <Text>{messageText}</Text>
      </Text>
      <Text style={styles.time}>{formattedTime}</Text>
    </View>
  );
}

const makeStyles = (theme: Theme, nameColor: string) => {
  return StyleSheet.create({
    message: {
      flex: 1,
      marginRight: 'auto',
    },
    name: {
      flex: 1,
      fontWeight: 'bold',
      color: nameColor,
    },
    time: {
      width: 80,
      textAlign: 'right',
      color: theme.colors.textSecondary,
    },
    wrapper: {
      flexDirection: 'row',
      marginVertical: 1,
    },
  });
};

export default ChatMessage;
