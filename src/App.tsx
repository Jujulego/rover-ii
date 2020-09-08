import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AppLayout from './components/layout/AppLayout';
import Map from './components/map/Map';
import { Layer } from 'src/maps/layer';

// Styles
const useStyle = makeStyles({
  map: {
    flex: 1
  }
})

// Component
const App = () => {
  // Memo
  const layer = useMemo(() => Layer.generate(100, 100, 'rock'), []);

  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      <section className={styles.map}>
        <Map center={{ x: 5, y: 1 }} layer={layer} />
      </section>
    </AppLayout>
  );
};

export default App;
