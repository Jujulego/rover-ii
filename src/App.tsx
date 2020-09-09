import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Layer } from 'src/maps/layer';

import AppLayout from './components/layout/AppLayout';
import Navigator from './components/Navigator';

// Styles
const useStyle = makeStyles(({ spacing }) => ({
  navigator: {
    flex: 1
  }
}));

// Component
const App = () => {
  // Memo
  const layer = useMemo(() => Layer.generate(20, 20, 'rock'), []);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      <Navigator className={styles.navigator} layer={layer} />
    </AppLayout>
  );
};

export default App;
