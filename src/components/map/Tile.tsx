import React, { FC, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { BIOMES, BiomeName } from 'src/biomes';

// Styles
const useStyles = makeStyles({
  tile: {
    position: 'absolute'
  }
});

// Types
export interface TileProps {
  x: number; y: number;
  h: number; w: number;
  biome: BiomeName;
  onClick?: () => void;
}

// Component
const Tile: FC<TileProps> = (props) => {
  // Props
  const {
    x, y, h, w,
    biome,
    onClick
  } = props;

  // Memo
  const style = useMemo(() => ({
    height: h,
    width:  w,
    left:   x * w,
    top:    y * h,
    backgroundImage: `url(${BIOMES[biome].floor})`
  }), [x, y, h, w, biome]);

  // Render
  const styles = useStyles();

  return (
    <div className={styles.tile} style={style} onClick={onClick} />
  );
};

export default Tile;
