import React, {useRef} from 'react';
import {Keyboard, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme, useTheme} from '../../lib/Theme';
import useKeyboardShown from './useKeyboardShown';

function KeyboardButton() {
  const textInputRef = useRef<TextInput | null>(null);
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
      <TextInput
        style={styles.textInput}
        ref={textInputRef}
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
      />
    </TouchableOpacity>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    textInput: {
      display: 'none',
    },
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
