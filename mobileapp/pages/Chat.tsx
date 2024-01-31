import React, {useEffect, useState} from 'react';
import useGameManager from '../lib/Game/useGameManager';
import PuzzleInfoHeader from '../components/Chat/PuzzleInfoHeader';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../lib/Theme';
import ChatMessages from '../components/Chat/ChatMessages';
import PlayerStatuses from '../components/Chat/PlayerStatuses';

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

  const styles = makeStyles(theme);
  return (
    <View style={styles.chat}>
      {puzzleInfo && <PuzzleInfoHeader puzzleInfo={puzzleInfo} />}
      <Divider />
      <PlayerStatuses playerStates={playerStates} />
      <Divider />
      <ChatMessages chatMessages={messages} />
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    chat: {
      padding: 10,
      height: '100%',
    },
    divider: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginVertical: 5,
      backgroundColor: 'none',
    },
  });
};

export default Chat;
