import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AppLayout from './layout/AppLayout';
import Map from './map/Map';

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
        <Map/>
      </section>
    </AppLayout>
  );
};

export default App;
