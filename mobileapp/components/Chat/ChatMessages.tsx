import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Message from '../../lib/Chat/Message';
import GameManager from '../../lib/Game/GameManager';
import useGameManager from '../../lib/Game/useGameManager';
import ChatMessage from './ChatMessage';

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
  const data = chatMessages
    .map(m => messageToMessageData(m, gameManager))
    .reverse();

  const styles = makeStyles();
  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.list}
        data={data}
        inverted={true}
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
    list: {
      flex: 1,
      flexGrow: 1,
    },
    wrapper: {
      paddingHorizontal: 10,
      flexGrow: 1,
    },
  });
};

export default ChatMessages;
