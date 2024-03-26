import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';

interface ClueItemProps {
  index: number;
  text: string;
}

function ClueItem(props: ClueItemProps) {
  const {index, text} = props;
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.clueItem}>
      <Text style={styles.number}>{index}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    text: {
      flex: 1,
      flexWrap: 'wrap',
      paddingBottom: 10,
      color: theme.colors.textPrimary,
    },
    number: {
      paddingHorizontal: 6,
      fontWeight: 'bold',
    },
    clueItem: {
      flexDirection: 'row',
    },
  });
};

export default ClueItem;
