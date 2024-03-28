import {Theme} from '../lib/Theme';
import {StyleSheet} from 'react-native';

export const makeTextInputStyles = (theme: Theme) => {
  return StyleSheet.create({
    textInput: {
      width: '100%',
      minHeight: 40,
      padding: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.border,
    },
  });
};
