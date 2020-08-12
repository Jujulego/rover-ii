import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Tile from './Tile';

// Styles
const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%'
  },
  map: {
    position: 'relative',
    overflow: 'hidden',

    margin: 'auto'
  }
});

// Component
const Map = () => {
  // Render
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.map} style={{ height: 192, width: 192 }}>
        <Tile x={0} y={0} />
        <Tile x={1} y={0} />
        <Tile x={2} y={0} />
        <Tile x={0} y={1} />
        <Tile x={1} y={1} />
        <Tile x={2} y={1} />
        <Tile x={0} y={2} />
        <Tile x={1} y={2} />
        <Tile x={2} y={2} />
      </div>
    </div>
  );
}

export default Map;
