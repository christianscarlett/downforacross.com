import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CluesInfo from '../../lib/Game/Clues';
import Direction from '../../util/Direction';

export interface ClueHeaderProps {
  cluesInfo: CluesInfo;
  clueIndex: number;
  direction: Direction;
}

function ClueHeader(props: ClueHeaderProps) {
  const [theme] = useTheme();
  const {cluesInfo, clueIndex, direction} = props;

  const clues = cluesInfo.getClues(direction);
  const clueText = clues[clueIndex];

  const styles = makeStyles(theme);
  return (
    <View style={styles.clueHeader}>
      <Icon name="keyboard-arrow-left" style={styles.chevronLeft} />
      <Text style={styles.clueName}>{`${clueIndex}${
        direction === Direction.ACROSS ? 'A' : 'D'
      }`}</Text>
      <ScrollView>
        <Text style={styles.clueText}>{clueText}</Text>
      </ScrollView>
      <Icon name="keyboard-arrow-right" style={styles.chevronRight} />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    chevronLeft: {
      paddingLeft: 20,
      paddingRight: 10,
      fontSize: 25,
    },
    chevronRight: {
      paddingLeft: 10,
      paddingRight: 20,
      fontSize: 25,
    },
    clueText: {
      color: theme.colors.textPrimary,
      paddingHorizontal: 10,
      flexShrink: 1,
      flexGrow: 1,
    },
    clueName: {
      color: theme.colors.textPrimary,
      fontWeight: 'bold',
      paddingHorizontal: 10,
    },
    clueHeader: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      height: 40,
      backgroundColor: theme.colors.tertiary,
    },
  });

export default ClueHeader;
