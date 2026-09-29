// ThemeProvider.tsx

import React, {createContext, useContext, ReactNode} from 'react';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    textcolor: string;
    whitecolor: string;
    transparent: string;
    msgcolor: string;
    btndisable: string;
    cream: string;
    headercolor: string;
    green: string;
    orange: string;
    red: string;
    gray: string;
    open: string;
    inprogress: string;
    close: string;
  };
  fonts: {
    regular: string;
    bold: string;
  };
  fontSizes: {
    thin: number;
    xthin: number;
    medium: number;
    regular: number;
    thick: number;
    xthick: number;
  };
}

interface ThemeContextType {
  theme: Theme;
}

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the useTheme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

// Define the ThemeProvider component
export const ThemeProvider: React.FC<{theme: Theme; children: ReactNode}> = ({
  theme,
  children,
}) => {
  return (
    <ThemeContext.Provider value={{theme}}>{children}</ThemeContext.Provider>
  );
};
