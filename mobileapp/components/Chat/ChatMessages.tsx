import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import ChatMessage from './ChatMessage';
import Message from '../../lib/Chat/Message';
import GameManager from '../../lib/Game/GameManager';
import useGameManager from '../../lib/Game/useGameManager';

export interface MessageData {
  displayName: string;
  nameColor: string;
  messageText: string;
  time: number;
}

interface ChatMessagesProps {
  chatMessages: Message[];
}

function messageToMessageData(
  message: Message,
  gameManager: GameManager,
): MessageData {
  const {senderId, text, timestamp} = message;
  const messageData = {
    displayName: '',
    nameColor: '',
    messageText: text,
    time: timestamp,
  };
  const state = gameManager.gameModel.playerModel.getState(senderId);
  if (state) {
    messageData.displayName = state.displayName;
    messageData.nameColor = state.color;
  }
  return messageData;
}

function ChatMessages(props: ChatMessagesProps) {
  const {chatMessages} = props;
  const gameManager = useGameManager();
  const data = chatMessages.map(m => messageToMessageData(m, gameManager));
  const styles = makeStyles();
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
