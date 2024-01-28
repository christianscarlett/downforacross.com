/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Theme, useTheme} from './lib/Theme';
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import PageNames from './lib/PageNames';
import GameHeaderRight from './components/Header/GameHeaderRight';
import Chat from './pages/Chat';
import {StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [theme] = useTheme();
  const styles = makeStyles(theme);
  return (
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
            headerRight: () => <GameHeaderRight />,
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
