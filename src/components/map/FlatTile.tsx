import React, { FC, useCallback, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { BIOMES, BiomeName } from 'src/biomes';
import { Vector } from 'src/utils/math2d';
import { useLayer } from './layer.context';

// Styles
const useStyles = makeStyles({
  tile: {
    position: 'absolute'
  }
});

// Types
export interface FlatTileProps {
  x: number; y: number;
  biome: BiomeName;
  onClick?: (position: Vector) => void;
}

// Component
const FlatTile: FC<FlatTileProps> = (props) => {
  // Props
  const {
    x, y,
    biome,
    onClick
  } = props;

  // Context
  const { tileSize: size } = useLayer();

  // Memo
  const style = useMemo(() => ({
    height: size,
    width:  size,
    left:   x * size,
    top:    y * size,
    backgroundImage: `url(${BIOMES[biome].flat})`
  }), [x, y, size, biome]);

  // Callbacks
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick({ x, y });
    }
  }, [onClick, x, y]);

  // Render
  const styles = useStyles();

  return (
    <div
      className={styles.tile} style={style}
      onClick={handleClick}
    />
  );
};

export default FlatTile;
