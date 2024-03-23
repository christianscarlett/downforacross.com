import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme, useTheme} from '../../lib/Theme';
import GameMenuItem from './GameMenuItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Scope from '../../lib/Puzzle/Scopes';

interface GameMenuProps {
  onCheck: (scope: Scope) => void;
  onClose: () => void;
}

enum GameMenuPage {
  INITIAL,
  SCOPE,
}

function GameMenu(props: GameMenuProps) {
  const {onCheck, onClose} = props;
  const [theme] = useTheme();
  const [page, setPage] = useState(GameMenuPage.INITIAL);
  const [selectedMenuItemTitle, setSelectedMenuItemTitle] = useState<
    string | null
  >(null);

  function openScope(title: string) {
    setSelectedMenuItemTitle(title);
    setPage(GameMenuPage.SCOPE);
  }

  function renderPage(selectedPage: GameMenuPage) {
    switch (selectedPage) {
      case GameMenuPage.INITIAL: {
        return (
          <>
            <GameMenuItem title="Check" onPress={() => openScope('Check')} />
            <GameMenuItem title="Reveal" onPress={() => openScope('Reveal')} />
            <GameMenuItem title="Reset" onPress={() => openScope('Reset')} />
          </>
        );
      }
      case GameMenuPage.SCOPE: {
        const scopes = Object.entries(Scope);
        const scopeItems = scopes.map(([_, scope]) => (
          <GameMenuItem
            key={scope}
            title={scope}
            onPress={() => {
              if (selectedMenuItemTitle === 'Check') {
                onCheck(scope);
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
              setSelectedMenuItemTitle('');
              setPage(GameMenuPage.INITIAL);
            }
          }}
        >
          <Icon name="chevron-left" style={styles.backButton} />
          <Text style={styles.selectedMenuItemTitle}>
            {selectedMenuItemTitle}
          </Text>
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
