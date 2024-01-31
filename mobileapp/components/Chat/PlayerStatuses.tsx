import React from 'react';
import PlayerState from '../../lib/Player/PlayerState';
import {StyleSheet, Text, View} from 'react-native';

interface PlayerProps {
  playerState: PlayerState;
}

function Player(props: PlayerProps) {
  const {displayName, color} = props.playerState;
  const styles = makePlayerStyles(color);
  return (
    <View style={styles.player}>
      <Text style={styles.dot}>{'●'}</Text>
      <Text style={styles.name}>{`${displayName}`}</Text>
    </View>
  );
}

const makePlayerStyles = (color: string) =>
  StyleSheet.create({
    dot: {
      color: color,
      fontSize: 7,
      marginRight: 2,
    },
    name: {
      color: color,
    },
    player: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
      marginVertical: 2,
    },
  });

export interface PlayersProps {
  playerStates: PlayerState[];
}

function PlayerStatuses(props: PlayersProps) {
  const {playerStates} = props;
  const players = playerStates.map((state, i) => (
    <Player key={i} playerState={state} />
  ));
  const styles = makeStyles();
  return <View style={styles.players}>{players}</View>;
}

const makeStyles = () =>
  StyleSheet.create({
    players: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
    },
  });

export default PlayerStatuses;
