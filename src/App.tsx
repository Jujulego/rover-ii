import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AppLayout from './components/layout/AppLayout';
import Map from './components/map/Map';

// Styles
const useStyle = makeStyles({
  map: {
    flex: 1
  }
})

// Component
const App = () => {
  // Render
  const styles = useStyle();

  return (
    <AppLayout>
      <section className={styles.map}>
        <Map center={{ x: 5, y: 1 }} />
      </section>
    </AppLayout>
  );
};

export default App;
