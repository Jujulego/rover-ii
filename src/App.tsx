import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Generators from 'src/maps/generators';

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
  // const layer = useMemo(() => Generators.simpleLayer({ h: 100, w: 250 }, 'rock'), []);
  const layer = useMemo(() => Generators.cellularLayer(
    { h: 100, w: 250 },
    { rock: .4, sand: .2 },
    { seed: 'test', iterations: 5, emptyBiome: 'water' }
  ), []);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      <Navigator className={styles.navigator} layer={layer} />
    </AppLayout>
  );
};

export default App;
