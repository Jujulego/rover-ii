import React, { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Layer } from 'src/maps/layer';

import AppLayout from './components/layout/AppLayout';
import Map from './components/map/Map';
import MiniMap from 'src/components/map/MiniMap';
import { Box } from '@material-ui/core';
import { Vector } from 'src/utils/math2d';

// Styles
const useStyle = makeStyles(({ spacing }) => ({
  container: {
    position: 'relative',

    flex: 1
  },
  map: {
    height: '100%'
  },
  miniMap: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
    zIndex: 10,
    height: 100,
    width: 100,

    borderRadius: '50%',
    overflow: 'hidden',
  }
}));

// Component
const App = () => {
  // State
  const [center, setCenter] = useState<Vector>({ x: -5, y: -5 });

  // Memo
  const layer = useMemo(() => Layer.generate(20, 20, 'rock'), []);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      <section className={styles.container}>
        <article className={styles.map}>
          <Map center={center} layer={layer} />
        </article>

        <Box className={styles.miniMap} boxShadow={2}>
          <MiniMap center={center} layer={layer} />
        </Box>
      </section>
    </AppLayout>
  );
};

export default App;
