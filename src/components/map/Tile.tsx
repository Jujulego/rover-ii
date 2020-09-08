import React, { FC } from 'react';

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
  z?: number;
}

// Component
const Tile: FC<TileProps> = (props) => {
  // Props
  const { x, y, z = 0 } = props;

  // Render
  const styles = useStyles();

  return (
    <div className={styles.tile} style={{ bottom: y * 64 - 32, left: x * 64 - 32, zIndex: z }}>
      <span>Tile</span>
    </div>
  );
};

export default Tile;
