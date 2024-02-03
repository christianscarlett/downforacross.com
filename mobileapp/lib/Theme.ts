import {createContext, useContext} from 'react';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textPencil: string;
    mainGray1: string;
    mainGray2: string;
    mainGray3: string;
  };
}

interface ThemeContext {
  theme: Theme;
}

export const LightTheme: Theme = {
  colors: {
    primary: '#6aa9f4',
    secondary: 'rgba(110, 198, 255, 1)',
    tertiary: '#dcefff',
    background: 'white',
    border: 'silver',
    textPrimary: 'black',
    textSecondary: 'rgba(0, 0, 0, 0.7)',
    textPencil: 'rgb(136, 136, 136)',
    mainGray1: '#666',
    mainGray2: '#ccc',
    mainGray3: '#f0f0f0',
  },
};

const themeContext = createContext<ThemeContext>({
  theme: LightTheme,
});

export const useTheme = (): [Theme] => {
  const context = useContext(themeContext);
  return [context.theme];
};
