import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Generators from 'src/maps/generators';

import AppLayout from './components/layout/AppLayout';
import Map from './components/map/Map';
import LayerContainer from './components/map/LayerContainer';
import Layer from './components/map/Layer';
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
  // const layer = useMemo(() => Generators.simpleLayer({ h: 100, w: 250 }, 'rock'), []);
  const layer = useMemo(() => Generators.cellularLayer(
    { h: 20, w: 20 },
    { grass: .4, sand: .2 },
    { iterations: 5, emptyBiome: 'water' }
  ), []);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      <div className={styles.navigator}>
        <LayerContainer tileSize={24} center={{ x: 10, y: 10 }}>
          <SvgLayer layer={layer} />
        </LayerContainer>
      </div>
    </AppLayout>
  );
};

export default App;
