import React from 'react';
import {Keyboard, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme, useTheme} from '../../lib/Theme';
import useKeyboardShown from './useKeyboardShown';

export interface KeyboardButtonProps {
  textInputRef: React.MutableRefObject<TextInput | null>;
}

function KeyboardButton(props: KeyboardButtonProps) {
  const {textInputRef} = props;
  const [keyboardShown] = useKeyboardShown();
  const tryToggleKeyboard = () => {
    if (keyboardShown) {
      Keyboard.dismiss();
    } else {
      textInputRef.current?.focus();
    }
  };

  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return (
    <TouchableOpacity style={styles.button} onPress={tryToggleKeyboard}>
      <Icon
        style={styles.icon}
        name={keyboardShown ? 'keyboard-hide' : 'keyboard'}
      />
    </TouchableOpacity>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    icon: {
      color: theme.colors.background,
      fontSize: 40,
    },
    button: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.mainGray2,
      borderRadius: 10,
      paddingHorizontal: 10,
      opacity: 0.5,
    },
  });

export default KeyboardButton;
