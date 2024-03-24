import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CluesInfo from '../../lib/Game/CluesInfo';
import Direction from '../../util/Direction';

export interface ClueHeaderProps {
  cluesInfo: CluesInfo;
  clueIndex: number | null;
  direction: Direction;
  onNextCluePressed: (clueIndex: number) => void;
  onPreviousCluePressed: (clueIndex: number) => void;
}

function ClueBar(props: ClueHeaderProps) {
  const [theme] = useTheme();
  const {
    cluesInfo,
    clueIndex,
    direction,
    onNextCluePressed,
    onPreviousCluePressed,
  } = props;

  const clues = cluesInfo.getClues(direction);
  const clueText = clueIndex !== null ? clues[clueIndex] : '';

  const styles = makeStyles(theme);
  return (
    <View style={styles.clueHeader}>
      <TouchableOpacity
        style={styles.chevronTouchable}
        onPress={() => {
          if (clueIndex) {
            onPreviousCluePressed(clueIndex);
          }
        }}
      >
        <Icon name="keyboard-arrow-left" style={styles.chevronLeft} />
      </TouchableOpacity>
      {clueIndex && (
        <Text style={styles.clueName}>{`${clueIndex}${
          direction === Direction.ACROSS ? 'A' : 'D'
        }`}</Text>
      )}
      <ScrollView>
        <Text style={styles.clueText}>{clueText}</Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.chevronTouchable}
        onPress={() => {
          if (clueIndex) {
            onNextCluePressed(clueIndex);
          }
        }}
      >
        <Icon name="keyboard-arrow-right" style={styles.chevronRight} />
      </TouchableOpacity>
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
    chevronTouchable: {
      height: '100%',
      justifyContent: 'center',
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

export default ClueBar;
