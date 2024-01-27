import {createContext, useContext} from 'react';

export interface Theme {
  colors: {
    primary: string;
    background: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textPencil: string;
  };
}

interface ThemeContext {
  theme: Theme;
}

export const LightTheme: Theme = {
  colors: {
    primary: '#6aa9f4',
    background: 'white',
    border: 'silver',
    textPrimary: 'black',
    textSecondary: 'rgba(0, 0, 0, 0.7)',
    textPencil: 'rgb(136, 136, 136)',
  },
};

const themeContext = createContext<ThemeContext>({
  theme: LightTheme,
});

export const useTheme = (): [Theme] => {
  const context = useContext(themeContext);
  return [context.theme];
};
