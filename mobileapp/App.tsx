import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTheme} from './lib/Theme';
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import PageNames from './lib/PageNames';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  let [theme] = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={PageNames.WELCOME}
          component={Welcome}
          options={{
            title: 'Down for a Cross',
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTitleStyle: {
              color: 'white',
            },
          }}
        />
        <Stack.Screen name={PageNames.GAME} component={Game} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
