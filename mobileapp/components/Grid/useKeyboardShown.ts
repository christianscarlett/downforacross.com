import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

function useKeyboardShown() {
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardShown(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShown(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return [keyboardShown, setKeyboardShown];
}

export default useKeyboardShown;
