import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import GameMenuItem from './GameMenuItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Scope from '../../lib/Puzzle/Scopes';

interface GameMenuProps {
  onCheck: (scope: Scope) => void;
  onReveal: (scope: Scope) => void;
  onReset: (scope: Scope) => void;
  onClose: () => void;
}

enum GameMenuPage {
  INITIAL,
  SCOPE,
}

enum InitialMenuItem {
  CHECK = 'Check',
  REVEAL = 'Reveal',
  RESET = 'Reset',
}

function GameMenu(props: GameMenuProps) {
  const {onCheck, onReveal, onReset, onClose} = props;
  const [theme] = useTheme();
  const [page, setPage] = useState(GameMenuPage.INITIAL);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);

  function openScope(title: string) {
    setSelectedMenuItem(title);
    setPage(GameMenuPage.SCOPE);
  }

  function renderPage(selectedPage: GameMenuPage) {
    switch (selectedPage) {
      case GameMenuPage.INITIAL: {
        const scopedCommands = [
          InitialMenuItem.CHECK,
          InitialMenuItem.REVEAL,
          InitialMenuItem.RESET,
        ];
        const scopedCommandItems = scopedCommands.map(command => (
          <GameMenuItem
            key={command}
            title={command}
            onPress={() => openScope(command)}
          />
        ));
        return scopedCommandItems;
      }
      case GameMenuPage.SCOPE: {
        const scopes = Object.entries(Scope);
        const scopeItems = scopes.map(([_, scope]) => (
          <GameMenuItem
            key={scope}
            title={scope}
            onPress={() => {
              switch (selectedMenuItem) {
                case InitialMenuItem.CHECK: {
                  onCheck(scope);
                  break;
                }
                case InitialMenuItem.REVEAL: {
                  onReveal(scope);
                  break;
                }
                case InitialMenuItem.RESET: {
                  onReset(scope);
                  break;
                }
              }
            }}
          />
        ));
        return scopeItems;
      }
    }
  }

  const styles = makeStyles(theme);
  return (
    <View style={styles.gameMenu}>
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navTouchable}
          onPress={() => {
            if (page === GameMenuPage.INITIAL) {
              onClose();
            } else if (page === GameMenuPage.SCOPE) {
              setSelectedMenuItem('');
              setPage(GameMenuPage.INITIAL);
            }
          }}
        >
          <Icon name="chevron-left" style={styles.backButton} />
          <Text style={styles.selectedMenuItemTitle}>{selectedMenuItem}</Text>
        </TouchableOpacity>
      </View>
      {renderPage(page)}
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    navTouchable: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nav: {
      height: 40,
      justifyContent: 'center',
      backgroundColor: theme.colors.mainGray2,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    selectedMenuItemTitle: {
      color: theme.colors.textSecondary,
    },
    backButton: {
      color: theme.colors.textSecondary,
      padding: 5,
      fontSize: 25,
    },
    gameMenu: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.mainGray3,
    },
  });
};

export default GameMenu;
