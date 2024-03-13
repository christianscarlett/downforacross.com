/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import GameHeaderRight from './components/Header/GameHeaderRight';
import GameContext, {
  GameContextIntf,
  getDefaultGameContext,
} from './context/GameContext';
import PageNames from './lib/PageNames';
import {Theme, useTheme} from './lib/Theme';
import Chat from './pages/Chat';
import Game from './pages/Game';
import Welcome from './pages/Welcome';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [theme] = useTheme();
  const [gameContext, setGameContext] = useState<GameContextIntf>(
    getDefaultGameContext(),
  );
  const styles = makeStyles(theme);
  return (
    <GameContext.Provider value={gameContext}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={PageNames.WELCOME}
            component={Welcome}
            options={{
              title: 'Down for a Cross',
              headerStyle: styles.header,
              headerTitleStyle: {
                color: 'white',
              },
            }}
          />
          <Stack.Screen
            name={PageNames.GAME}
            component={Game}
            options={{
              headerBackTitle: 'Home',
              headerTintColor: 'white',
              headerStyle: styles.header,
              headerRight: () => (
                <GameHeaderRight
                  gameContext={gameContext}
                  setGameContext={setGameContext}
                />
              ),
            }}
          />
          <Stack.Screen
            name={PageNames.CHAT}
            component={Chat}
            options={{
              headerBackTitle: 'Game',
              headerTintColor: 'white',
              headerStyle: styles.header,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameContext.Provider>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    header: {
      backgroundColor: theme.colors.primary,
    },
  });
};

export default App;
