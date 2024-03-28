import {useHeaderHeight} from '@react-navigation/elements';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, TextInput, View} from 'react-native';
import ChatMessages from '../components/Chat/ChatMessages';
import PlayerStatuses from '../components/Chat/PlayerStatuses';
import PuzzleInfoHeader from '../components/Chat/PuzzleInfoHeader';
import useGameManager from '../lib/Game/useGameManager';
import {Theme, useTheme} from '../lib/Theme';
import {makeTextInputStyles} from '../styles/textInputStyle';

function Divider() {
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return <View style={styles.divider} />;
}

function Chat() {
  const [theme] = useTheme();
  const gameManager = useGameManager();
  const [puzzleInfo, setPuzzleInfo] = useState(
    gameManager.gameModel.puzzleInfo,
  );
  const [messages, setMessages] = useState(
    gameManager.gameModel.chatModel.getMessages(),
  );
  const [playerStates, setPlayerStates] = useState(
    gameManager.gameModel.playerModel.getAllStates(),
  );

  useEffect(() => {
    function onUpdate() {
      setPuzzleInfo(gameManager.gameModel.puzzleInfo);
      setMessages([...gameManager.gameModel.chatModel.getMessages()]);
      setPlayerStates(gameManager.gameModel.playerModel.getAllStates());
    }
    gameManager.on('update', onUpdate);
    return () => {
      gameManager.removeListener('update', onUpdate);
    };
  }, [gameManager]);

  const headerHeight = useHeaderHeight();
  const styles = makeStyles(theme);
  return (
    <View style={styles.chat}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={headerHeight}
        behavior="position"
      >
        <View style={styles.inner}>
          {puzzleInfo && <PuzzleInfoHeader puzzleInfo={puzzleInfo} />}
          <Divider />
          <PlayerStatuses playerStates={playerStates} />
          <Divider />
          <ChatMessages chatMessages={messages} />
          <TextInput
            style={makeTextInputStyles(theme).textInput}
            placeholder="Say something..."
            placeholderTextColor={theme.colors.mainGray1}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    input: {
      flexDirection: 'row',
      marginVertical: 5,
    },
    chat: {
      height: '100%',
    },
    keyboardAvoiding: {
      flexGrow: 1,
    },
    divider: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginVertical: 5,
      backgroundColor: 'none',
    },
    inner: {
      height: '100%',
      padding: 5,
    },
  });
};

export default Chat;
