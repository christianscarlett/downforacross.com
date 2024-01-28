import React, {useEffect, useState} from 'react';
import useGameManager from '../lib/Game/useGameManager';
import PuzzleInfoHeader from '../components/Chat/PuzzleInfoHeader';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../lib/Theme';
import ChatMessages from '../components/Chat/ChatMessages';

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

  useEffect(() => {
    function onUpdate() {
      setPuzzleInfo(gameManager.gameModel.puzzleInfo);
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
      <ChatMessages />
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
