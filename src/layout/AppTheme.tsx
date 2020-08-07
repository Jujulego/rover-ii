import React, { ReactNode, useMemo } from 'react';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import createTheme from 'src/app.theme';

import useDarkTheme from './theme.hooks';

// Props
export interface AppThemeProps {
  children?: ReactNode
}

// Component
const AppTheme = ({ children }: AppThemeProps) => {
  // Theme
  const { prefersDark } = useDarkTheme();
  const theme = useMemo(() => createTheme(prefersDark), [prefersDark]);

  // Setup app theme
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { children }
    </ThemeProvider>
  );
};

export default AppTheme;
