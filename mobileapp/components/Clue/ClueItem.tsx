import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';

interface ClueItemProps {
  index: number;
  text: string;
  selected: boolean;
  perpendicular: boolean;
  onPress: () => void;
}

function ClueItem(props: ClueItemProps) {
  const {index, text, selected, perpendicular, onPress} = props;
  const [theme] = useTheme();
  const styles = makeStyles(theme, selected, perpendicular);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.clueItem}>
        <Text style={styles.number}>{index}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (
  theme: Theme,
  selected: boolean,
  perpendicular: boolean,
) => {
  return StyleSheet.create({
    text: {
      flex: 1,
      flexWrap: 'wrap',
      color: theme.colors.textPrimary,
      paddingVertical: 5,
    },
    number: {
      height: '100%',
      paddingVertical: 5,
      paddingHorizontal: 2,
      marginHorizontal: 4,
      fontWeight: 'bold',
      backgroundColor: perpendicular ? theme.colors.tertiary : 'transparent',
    },
    clueItem: {
      flexDirection: 'row',
      backgroundColor: selected ? theme.colors.tertiary : 'transparent',
    },
  });
};

export default ClueItem;
