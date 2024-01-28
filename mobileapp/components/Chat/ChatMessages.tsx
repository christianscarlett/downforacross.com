import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import ChatMessage from './ChatMessage';

interface MessageData {
  displayName: string;
  nameColor: string;
  messageText: string;
  time: string;
}

function ChatMessages() {
  const styles = makeStyles();
  const data: MessageData[] = [
    {
      displayName: 'Test Name',
      nameColor: 'blue',
      messageText: 'message',
      time: '1:33 AM',
    },
  ];
  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <ChatMessage
            displayName={item.displayName}
            nameColor={item.nameColor}
            messageText={item.messageText}
            time={item.time}
          />
        )}
      />
    </View>
  );
}

const makeStyles = () => {
  return StyleSheet.create({
    wrapper: {
      padding: 10,
      height: '100%',
    },
  });
};

export default ChatMessages;
