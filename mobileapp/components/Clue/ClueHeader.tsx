import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

function ClueHeader() {
  const [theme] = useTheme();

  const styles = makeStyles(theme);
  return (
    <View style={styles.clueHeader}>
      <Icon name="keyboard-arrow-left" style={styles.chevronLeft} />
      <Text style={styles.clueName}>1A</Text>
      <Text style={styles.clueText}>This is a clue.</Text>
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
      marginLeft: 'auto',
    },
    clueText: {
      color: theme.colors.textPrimary,
      paddingHorizontal: 10,
    },
    clueName: {
      color: theme.colors.textPrimary,
      fontWeight: 'bold',
      paddingHorizontal: 10,
    },
    clueHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 40,
      backgroundColor: theme.colors.tertiary,
    },
  });

export default ClueHeader;
