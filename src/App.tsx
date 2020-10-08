import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Generators from 'src/maps/generators';

import AppLayout from './components/layout/AppLayout';
import Navigator from './components/Navigator';
import LayerContainer from './components/map/LayerContainer';
import SvgLayer from './components/map/SvgLayer';
import { Vector } from './utils/math2d';
import { Layer } from './maps/layer';

// Styles
const useStyle = makeStyles(({ spacing }) => ({
  navigator: {
    flex: 1
  }
}));

// Component
const App = () => {
  // Memo
  // const layer = useMemo(() => Layer.fromMatrix([
  //   ['rock', 'rock', 'rock',  'rock', 'rock'],
  //   ['rock', 'rock', 'rock',  'rock', 'rock'],
  //   ['rock', 'water', 'water', 'rock', ''],
  //   ['rock', 'rock', 'rock',  'rock', 'rock'],
  //   ['rock', 'rock', '',  'rock', 'rock'],
  // ]), []);
  const layer = useMemo(() => Generators.cellularLayer(
    { h: 40, w: 40 },
    { grass: .4, sand: .2 },
    { seed: 'toto', iterations: 5, emptyBiome: 'water' }
  ), []);

  console.log(layer);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      {/*<Navigator className={styles.navigator} layer={layer} />*/}
      <LayerContainer tileSize={16} center={new Vector(19.5, 19.5)} mode="isometric">
        <SvgLayer layer={layer} />
      </LayerContainer>
    </AppLayout>
  );
};

export default App;
