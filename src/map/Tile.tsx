import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

// Styles
const useStyles = makeStyles({
  tile: {
    position: 'absolute',
    height: 64,
    width: 64,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

// Types
export interface TileProps {
  x: number;
  y: number;
}

// Component
const Tile = (props: TileProps) => {
  // Props
  const { x, y } = props;

  // Render
  const styles = useStyles();

  return (
    <div className={styles.tile} style={{ bottom: y * 64, left: x * 64 }}>
      <span>Tile</span>
    </div>
  );
};

export default Tile;
