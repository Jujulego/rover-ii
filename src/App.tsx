import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Generators from 'src/maps/generators';

import AppLayout from './components/layout/AppLayout';
import Navigator from './components/Navigator';
import LayerContainer from './components/map/LayerContainer';
import SvgLayer from './components/map/SvgLayer';
import { Vector } from './utils/math2d';

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
    { h: 10, w: 10 },
    { grass: .4, sand: .2 },
    { seed: 'toto', iterations: 5, emptyBiome: 'water' }
  ), []);

  console.log(layer);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      {/*<Navigator className={styles.navigator} layer={layer} />*/}
      <LayerContainer tileSize={16} center={new Vector(20, 20)}>
        <SvgLayer layer={layer} mode="flat" />
      </LayerContainer>
    </AppLayout>
  );
};

export default App;
