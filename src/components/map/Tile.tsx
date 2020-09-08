import React, { CSSProperties, FC, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { BIOMES, BiomeName } from 'src/biomes';

// Styles
const useStyles = makeStyles({
  tile: {
    position: 'absolute',
    height: 64,
    width: 64,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

// Types
export interface TileProps {
  x: number;
  y: number;
  z?: number;
  biome: BiomeName;
}

// Component
const Tile: FC<TileProps> = (props) => {
  // Props
  const {
    x, y, z = 0,
    biome
  } = props;

  // Memo
  const style = useMemo<CSSProperties>(() => ({
    left:   x * 64 - 32,
    bottom: y * 64 - 32,
    zIndex: z,
    backgroundImage: `url(${BIOMES[biome].floor})`
  }), [x, y, z, biome]);

  // Render
  const styles = useStyles();

  return (
    <div className={styles.tile} style={style}>
    </div>
  );
};

export default Tile;
