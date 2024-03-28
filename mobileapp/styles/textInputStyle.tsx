import {Theme} from '../lib/Theme';
import {StyleSheet} from 'react-native';

export const makeTextInputStyles = (theme: Theme) => {
  return StyleSheet.create({
    textInput: {
      flex: 1,
      flexGrow: 1,
      minHeight: 40,
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: theme.colors.border,
      textAlignVertical: 'center',
    },
  });
};
