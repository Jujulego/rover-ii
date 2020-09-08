import React, { ReactNode } from 'react';

import { AppBar as MuiAppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ThemeButton from 'src/components/layout/ThemeButton';

// Styles
const useStyles = makeStyles(({ palette, zIndex }) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: zIndex.drawer + 1
  },
  title: {
    flexGrow: 1
  },
  content: {
    height: '100vh',
    maxHeight: '100vh',
    flexGrow: 1,

    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',

    backgroundColor: palette.background.default
  }
}));

// Types
export interface AppBarProps {
  children?: ReactNode
}

// Component
const AppBar = (props: AppBarProps) => {
  // Props
  const { children } = props;

  // Render
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <MuiAppBar className={styles.appBar} position="fixed">
        <Toolbar>
          <Typography className={styles.title} variant="h6">Rover</Typography>
          <ThemeButton color="inherit" />
        </Toolbar>
      </MuiAppBar>
      <main className={styles.content}>
        <Toolbar disableGutters />
        { children }
      </main>
    </div>
  );
};

export default AppBar;
