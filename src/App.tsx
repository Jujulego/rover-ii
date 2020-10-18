import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Generators from 'src/maps/generators';

import AppLayout from './components/layout/AppLayout';
import Navigator from './components/Navigator';
import LayerContainer from './components/map/LayerContainer';
import { Vector } from './utils/math2d';
import SvgLayer from './components/map/SvgLayer';

// Styles
const useStyle = makeStyles(({ spacing }) => ({
  navigator: {
    flex: 1
  }
}));

// Component
const App = () => {
  // Memo
  const layer = useMemo(() => Generators.cellularLayer(
    { h: 40, w: 40 },
    { grass: .4, sand: .2 },
    { seed: 'toto', iterations: 5, emptyBiome: 'water' }
  ), []);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      {/*<Navigator className={styles.navigator} layer={layer} />*/}
      <LayerContainer tileSize={16} center={new Vector(20, 20)} mode="isometric">
        <SvgLayer layer={layer} />
      </LayerContainer>
    </AppLayout>
  );
};

export default App;
